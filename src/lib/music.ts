export type Track = {
  title: string;
  year: number;
  performer: string;
  src: string;
  source: string;
};

// Only add recordings that are public domain in the UK: published before 1956,
// and every writer of the song dead for more than 70 years.
export const TRACKS: readonly Track[] = [
  {
    title: "Daisy Bell",
    year: 1894,
    performer: "Edward M. Favor",
    src: "/music/daisy-bell-1894.mp3",
    source: "https://commons.wikimedia.org/wiki/File:Daisy_Bell_sung_by_Edward_M._Favor_denoised.ogg",
  },
  {
    title: "It’s a Long Way to Tipperary",
    year: 1915,
    performer: "Albert Farrington",
    src: "/music/tipperary-1915.mp3",
    source:
      "https://commons.wikimedia.org/wiki/File:Albert_Farrington_-_It%27s_a_Long_Long_Way_to_Tipperary_-_1915_-_remastered.oga",
  },
  {
    title: "Keep the Home Fires Burning",
    year: 1916,
    performer: "Frederick Wheeler",
    src: "/music/home-fires-1916.mp3",
    source: "https://commons.wikimedia.org/wiki/File:Keep_the_Home_Fires_Burning_-_Frederick_Wheeler.ogg",
  },
  {
    title: "Pack Up Your Troubles",
    year: 1917,
    performer: "Helen Clark",
    src: "/music/pack-up-your-troubles-1917.mp3",
    source:
      "https://commons.wikimedia.org/wiki/File:HelenClark-PackUpYourTroublesInYourOldKitBagAndSmileSmileSmile1917edisonCylinder.ogg",
  },
];
