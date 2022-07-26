const timesList = document.querySelector('.times__list');

const getPrayerTimes = async (url) => {
  timesList.classList.add('hidden');

  let response = await fetch(url);
  let json = await response.json();
  return json;
};

export default getPrayerTimes;
