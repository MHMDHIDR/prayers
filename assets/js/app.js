// Imports
import getPrayerTimes from './getPrayerTime.js'

// Variables
const date = new Date()
const year = date.getFullYear()
const month = date.getMonth() + 1
const dayOfWeek = date.getDay() //returns from 0 to 6
const todayDate = date.getDate()
const daysNameInArabic = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
]
const url = `https://api.aladhan.com/v1/calendarByCity?city=Doha&country=Qatar&month=${month}&year=${year}`
const today = document.querySelector('#today')
const prayer1 = document.querySelector('#prayer1')
const prayer2 = document.querySelector('#prayer2')
const prayer3 = document.querySelector('#prayer3')
const prayer4 = document.querySelector('#prayer4')
const prayer5 = document.querySelector('#prayer5')
const loading = document.querySelector('.loading')
const timesList = document.querySelector('.times__list')
const DATE_SEPARATOR = '/'
let localStoragePrayers = JSON.parse(localStorage.getItem('prayers'))

daysNameInArabic.forEach((dayName, index) => {
  if (dayOfWeek === index) {
    today.innerHTML = `
      ${dayName}
      <br>
      ${todayDate > 9 ? todayDate : '0' + todayDate}
      ${DATE_SEPARATOR}
      ${month > 9 ? month : '0' + month}
      ${DATE_SEPARATOR}
      ${year}
    `
  }
})

// Fetch Prayer Times Data
const getPrayerTimesData = async () =>
  getPrayerTimes(url)
    .then(data => localStorage.setItem('prayers', JSON.stringify(data.data)))
    .catch(err => (timesList.textContent = `عفواً حدث خطأ ما => ${err}`))

//Render Prayer Times
const renderPrayerTimes = () => {
  loading.remove()
  timesList.classList.remove('hidden')
  const prayerTimes = localStoragePrayers[todayDate - 1].timings

  const timeIn12Hrs = prayerName => {
    const hours = prayerName.split(':')[0] % 12
    const mins = prayerName.split(':')[1].split(' ')[0]
    const prayTime = hours + ':' + mins
    const hours24 = prayerName.split(':')[0]

    return `${hours24 > 11 ? prayTime + 'PM' : prayTime + 'AM'}`
  }

  const timeIn24Hrs = prayerName => prayerName.split(' ')[0]

  prayer1.textContent = timeIn12Hrs(prayerTimes.Fajr)
  prayer2.textContent = timeIn12Hrs(prayerTimes.Dhuhr)
  prayer3.textContent = timeIn12Hrs(prayerTimes.Asr)
  prayer4.textContent = timeIn12Hrs(prayerTimes.Maghrib)
  prayer5.textContent = timeIn12Hrs(prayerTimes.Isha)
}

//if there's no item in local Storage
if (localStoragePrayers === null || localStoragePrayers === undefined) {
  navigator.onLine
    ? getPrayerTimesData()
    : (timesList.textContent = 'الرجاء الاتصال بالانترنت')
} else {
  renderPrayerTimes()
}

let deferredPrompt
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  deferredPrompt = e
  listenToUserAction()
})

const installBtn = document.querySelector('.install__btn'),
  listenToUserAction = () => {
    installBtn.classList.remove('hidden')

    installBtn.addEventListener('click', () => presentAddToHome())
  },
  presentAddToHome = () => {
    deferredPrompt
      .prompt()
      .then(res => {
        if (res.outcome === 'accepted') {
          console.log(res.outcome)
        } else {
          deferredPrompt = null
        }
      })
      .catch(error => {
        deferredPrompt = null
        console.log(error)
      })
  }
