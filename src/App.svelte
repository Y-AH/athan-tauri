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

<main class="prayer-panel">
  <div>
    <div class="prayer">
      <span>Fajir:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.fajr)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class="prayer">
      <span>Sunrise:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.sunrise)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class="prayer">
      <span>Duhr:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.dhuhr)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class="prayer">
      <span>Asr:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.asr)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class="prayer">
      <span>Maghrib:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.maghrib)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class="prayer">
      <span>Isha:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.isha)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
  </div>
  <div class="countdown">
    Time until next prayer {msToTime(nextPrayerTime.getTime() - Date.now())}
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
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    transition: background-color 0.3s;
  }

  .prayer-panel {
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 300px;
    transition: background-color 0.3s;
  }

  .prayer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .prayer > :first-child {
    justify-self: start; /* Aligns to the left of its cell */
  }

  /* .prayer > :nth-child(2) {
    justify-self: center;
  } */

  .prayer > :last-child {
    justify-self: end; /* Aligns to the right of its cell */
    margin-bottom: 0;
  }

  .prayer-time {
    color: #555;
  }

  .pause-button {
    background-color: #ddd;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    transition: background-color 0.3s;
  }

  .pause-button::before {
    content: "||";
    color: #555;
  }

  .countdown {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  /* Light theme styles (default) */
  body {
    background-color: #f4f4f4;
  }

  .prayer-panel {
    background-color: #fff;
  }

  /* Dark theme styles */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #1a1a1a;
    }

    .prayer-panel {
      background-color: #333;
    }

    .prayer-time,
    .countdown {
      color: #ccc;
    }

    .pause-button {
      background-color: #555;
    }

    .pause-button::before {
      color: #ccc;
    }
  }
</style>
