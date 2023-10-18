const PLATFORM = "Sample";

var config = {};

//Source Methods
source.enable = function(conf, settings, savedState){
	config = conf ?? {};
	//throw new ScriptException("This is a sample");
}
source.getHome = function() {
	//return new ContentPager([], false);
	//function getVideoPager(path, params, page) {
		const apiUrl = 'https://api.vanillo.tv/v1/videos/recommended?limit=30'
		const apiResponse = fetch(apiUrl)
		const apiData = apiResponse.json()
		const videos = apiData.data.videos
	  
		function timestamp_to_human(timestamp) {
		  const current_time = Date.now() / 1000;
		  var time_diff = current_time - timestamp;
		  let time_unit = "second";
	  
		  if (time_diff >= 31536000) {
			time_diff = Math.floor(time_diff / 31536000);
			time_unit = "year";
		  } else if (time_diff >= 2592000) {
			time_diff = Math.floor(time_diff / 2592000);
			time_unit = "month";
		  } else if (time_diff >= 604800) {
			time_diff = Math.floor(time_diff / 604800);
			time_unit = "week";
		  } else if (time_diff >= 86400) {
			time_diff = Math.floor(time_diff / 86400);
			time_unit = "day";
		  }
	  
		  if (time_diff > 1) {
			time_unit += "s";
		  }
	  
		  return `${time_diff} ${time_unit} ago`;
		}
		
	  const response = []
	  
	  for (const video of videos) {
		return new PlatformVideo({
			id: new PlatformID(PLATFORM, video.id, config.id),
			name: video.title,
			thumbnails: video.thumbnail,
			author: new PlatformAuthorLink(
				new PlatformID(PLATFORM, video.uploader.id.toString(), config.id, PLATFORM_CLAIMTYPE),
				video.uploader.displayName,
				video.uploader.url,
				video.uploader.avatar
			),
			uploadDate: parseInt(new Date(video.publishedAt).getTime() / 1000),
			duration: video.duration,
			viewCount: video.views,
			url: id,
			isLive: false,
		});
	  }
};

source.searchSuggestions = function(query) {
	throw new ScriptException("This is a sample");
};
source.getSearchCapabilities = () => {
	return {
		types: [Type.Feed.Mixed],
		sorts: [Type.Order.Chronological],
		filters: [ ]
	};
};
source.search = function (query, type, order, filters) {
	return new ContentPager([]. false);
};
source.getSearchChannelContentsCapabilities = function () {
	return {
		types: [Type.Feed.Mixed],
		sorts: [Type.Order.Chronological],
		filters: []
	};
};
source.searchChannelContents = function (channelUrl, query, type, order, filters) {
	throw new ScriptException("This is a sample");
};

source.searchChannels = function (query) {
	throw new ScriptException("This is a sample");
};

//Channel
source.isChannelUrl = function(url) {
	throw new ScriptException("This is a sample");
};
source.getChannel = function(url) {
	throw new ScriptException("This is a sample");
};
source.getChannelContents = function(url) {
	throw new ScriptException("This is a sample");
};

//Video
source.isContentDetailsUrl = function(url) {
	throw new ScriptException("This is a sample");
};
source.getContentDetails = function(url) {
	throw new ScriptException("This is a sample");
};

//Comments
source.getComments = function (url) {
	throw new ScriptException("This is a sample");

}
source.getSubComments = function (comment) {
	throw new ScriptException("This is a sample");
}



/* json reader */
function getVideoPager(path, params, page) {
	log(`getVideoPager page=${page}`, params);
  
	const count = 20;
	const start = (page ?? 0) * count;
	params = { ...params, start, count };
  
	const url = `${plugin.config.constants.baseUrl}${path}`;
	const urlWithParams = `${url}${buildQuery(params)}`;
	log("GET " + urlWithParams);
	const res = http.GET(urlWithParams, {});
  
	if (res.code !== 200) {
	  log("Failed to get videos", res);
	  return new VideoPager([], false);
	}
  
	const obj = JSON.parse(res.body);
  
	if (!Array.isArray(obj.data)) {
	  log("Data is not an array");
	  return new VideoPager([], false);
	}
  
	const platformVideos = obj.data.map((v) => ({
	  id: new PlatformID(PLATFORM, v.id, config.id),
	  name: v.title || "",
	  thumbnails: new Thumbnails([new Thumbnail(`${v.defaultThumbnails[0]}`, 0)]),
	  author: new PlatformAuthorLink(
		new PlatformID(PLATFORM, v.uploader.url, config.id),
		v.uploader.displayName,
		v.uploader.url,
		v.uploader.avatar ? `${baseUrl}${v.uploader.avatar}` : ""
	  ),
	  datetime: Math.round(new Date(v.publishedAt).getTime() / 1000),
	  duration: v.duration,
	  viewCount: v.views,
	  url: v.id,
	  isLive: v.live,
	}));
  
	return new VideoPager(platformVideos, true);
  }

  function buildQuery(params) {
	let query = "";
	let first = true;
	for (const [key, value] of Object.entries(params)) {
		if (value) {
			if (first) {
				first = false;
			} else {
				query += "&";
			}

			query += `${key}=${value}`;
		}
	}

	return (query && query.length > 0) ? `?${query}` : ""; 
}

log("LOADED");