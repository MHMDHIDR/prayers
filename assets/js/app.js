// const url = "https://api.pray.zone/v2/times/today.json?city=doha";
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const dayOfWeek = date.getDay();
const todayDate = date.getDate();
const daysInArabic = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];
const url = `http://api.aladhan.com/v1/calendarByCity?city=Doha&country=Qatar&method=10&month=${month}&year=${year}`;

const today = document.querySelector("#today");
const prayer1 = document.querySelector("#prayer1");
const prayer2 = document.querySelector("#prayer2");
const prayer3 = document.querySelector("#prayer3");
const prayer4 = document.querySelector("#prayer4");
const prayer5 = document.querySelector("#prayer5");
const loading = document.querySelector(".loading");
const timesList = document.querySelector(".times__list");

daysInArabic.forEach((day, index) => {
  if (dayOfWeek === index) {
    today.textContent = `${day} - ${year}/${month}/${todayDate}`;
  }
});

const getPrayerTimes = async () => {
  loading.classList.remove("hidden");
  timesList.classList.add("hidden");

  let response = await fetch(url);
  let json = await response.json();
  return json;
};

getPrayerTimes()
  .then((data) => {
    loading.classList.add("hidden");
    timesList.classList.remove("hidden");

    const dateTimes = data.data[dayOfWeek - 1];
    const prayerTimes = dateTimes.timings;

    prayer1.textContent = prayerTimes.Fajr.split(" ")[0];
    prayer2.textContent = prayerTimes.Dhuhr.split(" ")[0];
    prayer3.textContent = prayerTimes.Asr.split(" ")[0];
    prayer4.textContent = prayerTimes.Maghrib.split(" ")[0];
    prayer5.textContent = prayerTimes.Isha.split(" ")[0];
  })
  .catch((err) => {
    timesList.textContent = `there is an error! : ${err}`;
  });
