const PLATFORM = "Sample";

var config = {};

//Source Methods
source.enable = function(conf, settings, savedState){
	config = conf ?? {};
	throw new ScriptException("This is a sample");
}
source.getHome = function() {
	//return new ContentPager([], false);
	//function getVideoPager(path, params, page) {
	return getVideoPager('/v1/videos/recommended', {
		limit: "30"
	}, 0);
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


log("LOADED");