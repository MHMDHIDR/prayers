// const url = "https://api.pray.zone/v2/times/today.json?city=doha";
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const dayOfWeek = date.getDay();
const todayDate = date.getDate();
const daysNameInArabic = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت"
];
const url = `https://api.aladhan.com/v1/calendarByCity?city=Doha&country=Qatar&method=10&month=${month}&year=${year}`;

const today = document.querySelector("#today");
const prayer1 = document.querySelector("#prayer1");
const prayer2 = document.querySelector("#prayer2");
const prayer3 = document.querySelector("#prayer3");
const prayer4 = document.querySelector("#prayer4");
const prayer5 = document.querySelector("#prayer5");
const loading = document.querySelector(".loading");
const timesList = document.querySelector(".times__list");
const DATE_SEPARATOR = "/";

daysNameInArabic.forEach((dayName, index) => {
  if (dayOfWeek === index) {
    today.textContent = `
      ${dayName} - 
      ${todayDate > 9 ? todayDate : "0" + todayDate}
      ${DATE_SEPARATOR}
      ${month > 9 ? month : "0" + month}
      ${DATE_SEPARATOR}
      ${year}
    `;
  }
});

const getPrayerTimes = async () => {
  timesList.classList.add("hidden");

  let response = await fetch(url);
  let json = await response.json();
  return json;
};

getPrayerTimes()
  .then((data) => {
    loading.remove();
    timesList.classList.remove("hidden");

    const dateTimes = data.data[dayOfWeek - 1];
    const prayerTimes = dateTimes.timings;

    const timeIn12HrsSystem = (prayerName) => {
      const hours = prayerName.split(":")[0] % 12;
      const mins = prayerName.split(":")[1].split(" ")[0];
      return `${hours > 9 ? hours : "0" + hours}:${mins}`;
    };

    const timeIn24HrsSystem = (prayerName) => {
      return prayerName.split(" ")[0];
    };

    prayer1.textContent = timeIn12HrsSystem(prayerTimes.Fajr);
    prayer2.textContent = timeIn12HrsSystem(prayerTimes.Dhuhr);
    prayer3.textContent = timeIn12HrsSystem(prayerTimes.Asr);
    prayer4.textContent = timeIn12HrsSystem(prayerTimes.Maghrib);
    prayer5.textContent = timeIn12HrsSystem(prayerTimes.Isha);
  })
  .catch((err) => {
    timesList.textContent = `there is an error! : ${err}`;
  });

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  listenToUserAction();
});

const installBtn = document.querySelector(".install__btn"),
  listenToUserAction = () => {
    installBtn.classList.remove("hidden");

    installBtn.addEventListener("click", () => presentAddToHome());
  },
  presentAddToHome = () => {
    deferredPrompt
      .prompt()
      .then((res) => {
        if (res.outcome === "accepted") {
          console.log(res.outcome);
        } else {
          deferredPrompt = null;
        }
      })
      .catch((haha) => {
        deferredPrompt = null;
        console.log(haha);
      });
  };
