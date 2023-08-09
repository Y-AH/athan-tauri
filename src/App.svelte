<script>
  import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

  const coordinates = new Coordinates(29.3117, 47.4818);
  const calculationMethod = CalculationMethod.Kuwait();
  let date = new Date();
  $: prayerTimes = new PrayerTimes(coordinates, date, calculationMethod);
  $: nextPrayer = prayerTimes.nextPrayer(new Date());
  $: nextPrayerTime =
    nextPrayer === "none"
      ? new PrayerTimes(
          coordinates,
          new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
          calculationMethod
        ).timeForPrayer("fajr")
      : prayerTimes.timeForPrayer(nextPrayer);

  const handle = setInterval(() => {
    date = new Date();
  }, 500);

  function msToTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

    return formattedTime;
  }

  function formatTimeWithAMPM(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedTime = `${(hours % 12 || 12)
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;

    return formattedTime;
  }
</script>

<main>
  <div>
    Time until next prayer {msToTime(nextPrayerTime.getTime() - Date.now())}
  </div>

  <div>
    <div>Fajir: {formatTimeWithAMPM(prayerTimes.fajr)}</div>
    <div>Sunrise: {formatTimeWithAMPM(prayerTimes.sunrise)}</div>
    <div>Duhr: {formatTimeWithAMPM(prayerTimes.dhuhr)}</div>
    <div>Asr: {formatTimeWithAMPM(prayerTimes.asr)}</div>
    <div>Maghrib: {formatTimeWithAMPM(prayerTimes.maghrib)}</div>
    <div>Isha: {formatTimeWithAMPM(prayerTimes.isha)}</div>
  </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
