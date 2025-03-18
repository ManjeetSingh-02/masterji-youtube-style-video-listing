// get elements from id's
const videoContainer = document.getElementById("videoContainer");
const videoSearch = document.getElementById("videoSearch");
const videoSearchBtn = document.getElementById("videoSearchBtn");

// url for api fetch request
const apiUrl =
  "https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=100&query=javascript&sortBy=keep%2520one%253A%2520mostLiked%2520%257C%2520mostViewed%2520%257C%2520latest%2520%257C%2520oldest";

// options for api fetch request
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

// url to construct for youtube channel
const youtubeChannelUrl = "https://www.youtube.com/channel/";

// url to construct for youtube video
const youtubeVideoUrl = "https://www.youtube.com/watch?v=";

// array to store all the fetched videos
const allVideos = [];

// eventlistener to search the video from the enter key
videoSearch.addEventListener("keypress", (event) => {
  if (event.code === "Enter") searchVideos();
});

// eventlistener to search the video from the input button
videoSearchBtn.addEventListener("click", searchVideos);

// function to give the searched videos
function searchVideos() {
  // get the searched value
  const searched = videoSearch.value.trim().toLowerCase();

  // if no value, then display error message and return
  if (!searched || searched === "") {
    videoSearch.value = "";
    videoSearch.placeholder = "Please enter something to search!";
    return;
  }

  // initialize search videos
  let searchedVideos = [];

  // filter the searched videos from all videos
  searchedVideos = allVideos.filter((video) => video.title.toLowerCase().includes(searched));

  // if no videos, then display error message and return
  if (searchedVideos.length <= 0) {
    videoSearch.value = "";
    videoSearch.placeholder = "No videos found!";
    return;
  }

  // remove all the videos from container
  videoContainer.innerHTML = "";

  // add all the searched videos inside container
  searchedVideos.forEach((video) => addToGrid(video));
}

// function to get views
function getViews(views) {
  // check for Billion views
  if (views >= 1_000_000_000) (views / 1_000_000_000).toString().split(".")[0] + "." + (views / 1_000_000_000).toString().split(".")[1][0] + "B Views";
  // check for Million views
  else if (views >= 1_000_000) views = (views / 1_000_000).toString().split(".")[0] + "." + (views / 1_000_000).toString().split(".")[1][0] + "M Views";
  // check for Thousand views
  else if (views >= 1_000) views = (views / 1_000).toString().split(".")[0] + "." + (views / 1_000).toString().split(".")[1][0] + "K Views";
  else views = views + " Views";

  // return views
  return views;
}

// function to get upload time
function getUploadTime(published) {
  // get previous and current date
  const publishedDate = new Date(published);
  const todayDate = new Date();

  // find diff b/w two dates in milliseconds
  const diffTime = todayDate - publishedDate;

  // Convert milliseconds to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // return no of days
  return `${diffDays} days ago`;
}

// function to add the fetched yt video to grid to show on homepage
function addToGrid(videoObj) {
  // create main div
  const videoBox = document.createElement("div");
  videoBox.classList.add("video-box");

  // create image div
  const imageBox = document.createElement("a");
  imageBox.classList.add("image-box");
  imageBox.href = youtubeVideoUrl + videoObj.id;
  imageBox.target = "_blank";

  // create image element for thumbnail
  const thumbnailImg = document.createElement("img");
  thumbnailImg.src = videoObj.thumbnails.maxres.url;
  thumbnailImg.alt = "Video Thumbnail";

  // create image element for play button
  const playImg = document.createElement("img");
  playImg.src = "./assets/icons/play.svg";
  playImg.alt = "Play Video";

  // append both images to image div
  imageBox.appendChild(thumbnailImg);
  imageBox.appendChild(playImg);

  // create info div
  const infoBox = document.createElement("div");
  infoBox.classList.add("info-box");

  // create title tag and input the video title
  const videoTitle = document.createElement("h3");
  videoTitle.textContent = videoObj.title;

  // create div to show statistics
  const statsBox = document.createElement("div");
  statsBox.classList.add("stats-box");

  // create a tag to display channel name
  const channelName = document.createElement("a");
  channelName.textContent = videoObj.channelTitle;
  channelName.href = youtubeChannelUrl + videoObj.channelId;
  channelName.target = "_blank";

  // create h4 tag to display video views
  const views = document.createElement("h4");
  views.textContent = getViews(Number(videoObj.viewCount));

  // create h4 tag to display video upload time
  const uploadTime = document.createElement("h4");
  uploadTime.textContent = getUploadTime(videoObj.publishedAt);

  // append stats into stats div
  statsBox.appendChild(channelName);
  statsBox.appendChild(views);
  statsBox.appendChild(uploadTime);

  // append the title and stats to div
  infoBox.appendChild(videoTitle);
  infoBox.appendChild(statsBox);

  // append the child div's into parent div
  videoBox.appendChild(imageBox);
  videoBox.appendChild(infoBox);

  // append the parent div inside container
  videoContainer.appendChild(videoBox);
}

// function to fetch and load all videos on homepage
function fetchFreeApiData(apiUrl, options) {
  // fetch api request
  fetch(apiUrl, options)
    .then((res) => res.json())
    .then((apiData) => {
      // fetch each video data from the array
      apiData.data.data.forEach((videoInfo) => {
        // create object to store video info
        const videoObj = {
          title: videoInfo.items.snippet.title,
          id: videoInfo.items.id,
          publishedAt: videoInfo.items.snippet.publishedAt,
          channelId: videoInfo.items.snippet.channelId,
          channelTitle: videoInfo.items.snippet.channelTitle,
          thumbnails: videoInfo.items.snippet.thumbnails,
          viewCount: videoInfo.items.statistics.viewCount,
        };

        // store the fetched video in to array
        allVideos.push(videoObj);

        // send the object
        addToGrid(videoObj);
      });
    })
    .catch((error) => console.log(error));
}

// start application by fetching videos from api's to display
fetchFreeApiData(apiUrl, options);
