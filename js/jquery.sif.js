/*===================================
Name: Social Image Feed JQuery Plugin
=====================================
Description: Get an image feed from various social networks and art galleries 
=====================================
Author: DemirevDesign
=====================================
License: http://mit-license.org/
=====================================
Version: 1.6
===================================*/

(function($){
	// Create object
	SIFO = function(el, options) {
		this.create(el, options);
	};
	
	//Build function settings and actions
	$.extend(SIFO.prototype, {
		
		create: function(el, options) {
			
			// Set the default options
			this.defaults = {
				instagramID: '',
				instagramHook: 'instagram-feed',
				tumblrID: '',
				tumblrHook: 'tumblr-feed',
				weheartitID: '',
				weheartitHook: 'weheartit-feed',
				pinterestID: '',
				pinterestHook: 'pinterest-feed',
				flickrID: '',
				flickrHook: 'flickr-feed',
				deviantartID: '',
				deviantartHook: 'deviantart-feed',
				dribbbleID: '',
				dribbbleHook: 'dribbble-feed',
				behanceID: '',
				behanceHook: 'behance-feed',
				noThumb: '',
				newWindow: true,
				numResults: 8,
			};

			var o = $.extend(true,this.defaults,options);
			
			if(o.newWindow){
				var newWindow = '_blank'
			} else {
				var newWindow = '_self';
			}
			
	// Set Social RSS URLs to add to Google RSS API for JSON transformation

	// Instagram Feed
		if(!o.instagramID == ''){
				var url = '//api.instagram.com/v1/users/self/media/recent/?access_token='+o.instagramID;
					
				// Add ul tag to target element
				$('#'+o.instagramHook).append('<ul id="'+o.instagramHook+'-stream"></ul>');
				// jQuery AJAX call
				jQuery.ajax({
					url: url,
					cache: true,
					dataType: 'jsonp',
					error: 'There is an AJAX error, revisit code.',
					success: function(a){
						a = a.data;
						$.each(a, function(i,item){
							if(i < o.numResults){
								// Set permalink
								var perma = item.link;
								// Parse the `content`
								//var content = $($.parseHTML(item.content));
								// Set thumbnails
								var thumb = item.images.low_resolution.url;
								//console.log(thumb);
								// Build HTML
								var link = 'href="'+perma+'"';
								var html = '<li class="feed-image-wrapper"><a '+link+' target="'+newWindow+'"><div class="feed-image" style="background-image: url('+thumb+')"></div></a></li>';
							}
							// Add feed items to stream
							$('#'+o.instagramHook+'-stream',el).append(html);
						});
					},
					complete: function(a){
					}
				});
			}
	// Tumblr Feed
			if(!o.tumblrID == ''){
				var href = 'http://'+o.tumblrID+'/rss',
					url = '//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22'+ encodeURIComponent(href) +'%22%20limit%20'+ o.numResults +'&format=json&callback=?'
					//url = '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+o.numResults+'&callback=?&q='+encodeURIComponent(href);
					
				// Add ul tag to target element
				$('#'+o.tumblrHook).append('<ul id="'+o.tumblrHook+'-stream"></ul>');
				
				// jQuery AJAX call
				jQuery.ajax({
					url: url,
					cache: true,
					dataType: 'jsonp',
					error: 'There is an AJAX error, revisit code.',
					success: function(a){
						a = a.query.results.item;
						//console.log(JSON.stringify(a));
						$.each(a, function(i,item){
							if(i < o.numResults){
								// Set permalink
								var perma = item.link;
								// Parse post content
								var content = $($.parseHTML(item.description));
								// Set thumbnails
								var thumb = $(content).attr('src');
								// Check first tag
								var tag = content[0].tagName;
								// If first tag is iframe, set default thumbnail
								if(tag == 'IFRAME'){
									var thumb = o.noThumb;
								}
								// If we still haven't found img - try to find it in the post, if still no img - set default thumbnail
								if(!thumb){
									var countImg = $(content).find('img').length;
									if(countImg >= 1){
										var thumb = $('img', content).attr('src');
									} else {
										var thumb = o.noThumb;
									}
								}
								// Build HTML
								var link = 'href="'+perma+'"';
								var html = '<li class="feed-image-wrapper"><a '+link+' target="'+newWindow+'"><div class="feed-image" style="background-image: url('+thumb+')"></div></a></li>';
							}
							// Add feed items to stream
							$('#'+o.tumblrHook+'-stream',el).append(html);
						});
					},
					complete: function(){
					}
				});
			}
	// WeHeartIt Feed
			if(!o.weheartitID == ''){
				var href = 'http://weheartit.com/'+o.weheartitID+'.rss',
					url = '//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22'+ encodeURIComponent(href) +'%22%20limit%20'+ o.numResults +'&format=json&callback=?'
					//url = '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+o.numResults+'&callback=?&q='+encodeURIComponent(href);
					
				// Add ul tag to target element
				$('#'+o.weheartitHook).append('<ul id="'+o.weheartitHook+'-stream"></ul>');
				
				// jQuery AJAX call
				jQuery.ajax({
					url: url,
					cache: true,
					dataType: 'jsonp',
					error: 'There is an AJAX error, revisit code.',
					success: function(a){
						a = a.query.results.item;
						$.each(a, function(i,item){
							if(i < o.numResults){
								// Set permalink
								var perma = item.link;
								// Parse the `content`
								var content = $($.parseHTML(item.description));
								// Set thumbnails
								var thumb = $(content).attr('src');
								// Because WeHeartIt RSS 2.0 gives only large uncompressed thumb we need to change URL
								if(thumb){
									thumb = thumb.replace('large', 'superthumb');
								}
								// Show No Thumb if no image is found
								if(!thumb){
									thumb = o.noThumb;
								}
								// Build HTML
								var link = 'href="'+perma+'"';
								var html = '<li class="feed-image-wrapper"><a '+link+' target="'+newWindow+'"><div class="feed-image" style="background-image: url('+thumb+')"></div></a></li>';
							}
							// Add feed items to stream
							$('#'+o.weheartitHook+'-stream',el).append(html);
						});
					},
					complete: function(a){
					}
				});
			}
	// Pinterest Feed
			if(!o.pinterestID == ''){
				var href = 'http://www.pinterest.com/'+o.pinterestID+'/feed.rss',
					url = '//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22'+ encodeURIComponent(href) +'%22%20limit%20'+ o.numResults +'&format=json&callback=?'
					//url = '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&format=xml&num='+o.numResults+'&callback=?&q='+encodeURIComponent(href);
					
				// Add ul tag to target element
				$('#'+o.pinterestHook).append('<ul id="'+o.pinterestHook+'-stream"></ul>');
				
				// jQuery AJAX call
				jQuery.ajax({
					url: url,
					cache: true,
					dataType: 'jsonp',
					error: 'There is an AJAX error, revisit code.',
					success: function(a){
						//console.log(JSON.stringify(a));
						a = a.query.results.item;
						$.each(a, function(i,item){
							if(i < o.numResults){
								// Set permalin
								var perma = item.link;
								// Parse the `content`
								var content = $($.parseHTML(item.description));
								// Set thumbnails
								var thumb = $('img',content).attr('src');
								// Build HTML
								var link = 'href="'+perma+'"';
								var html = '<li class="feed-image-wrapper"><a '+link+' target="'+newWindow+'"><div class="feed-image" style="background-image: url('+thumb+')"></div></a></li>';
							}
							// Add feed items to stream
							$('#'+o.pinterestHook+'-stream',el).append(html);
						});
					},
					complete: function(a){
					}
				});
			}
	// Flickr Feed
	// We get JSON direcrly from Flickr, no need for Google RSS API
			if(!o.flickrID == ''){
				var url = '//api.flickr.com/services/feeds/photos_public.gne?id='+o.flickrID+'&format=json&jsoncallback=?';
					
				// Add ul tag to target element
				$('#'+o.flickrHook).append('<ul id="'+o.flickrHook+'-stream"></ul>');
				// jQuery AJAX call
				jQuery.ajax({
					url: url,
					cache: true,
					dataType: 'json',
					error: 'There is an AJAX error, revisit code.',
					success: function(a){
						a = a.items;
						//console.log(JSON.stringify(a));
						$.each(a, function(i,item){
							if(i < o.numResults){
								// Set permalink
								var perma = item.link;
								// Parse the `content`
								var content = $($.parseHTML(item.content));
								// Set thumbnails
								var thumb = item.media.m;
								// Build HTML
								var link = 'href="'+perma+'"';
								var html = '<li class="feed-image-wrapper"><a '+link+' target="'+newWindow+'"><div class="feed-image" style="background-image: url('+thumb+')"></div></a></li>';
							}
							// Add feed items to stream
							$('#'+o.flickrHook+'-stream',el).append(html);
						});
					},
					complete: function(a){
					}
				});
			}
	// DeviantArt Feed
			if(!o.deviantartID == ''){
				var href = 'http://backend.deviantart.com/rss.xml?q=gallery%3A'+o.deviantartID,
					url = '//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22'+ encodeURIComponent(href) +'%22%20limit%20'+ o.numResults +'&format=json&callback=?'
					//url = '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+o.numResults+'&callback=?&q='+encodeURIComponent(href);
					
				// Add ul tag to target element
				$('#'+o.deviantartHook).append('<ul id="'+o.deviantartHook+'-stream"></ul>');
				
				// jQuery AJAX call
				jQuery.ajax({
					url: url,
					cache: true,
					dataType: 'jsonp',
					error: 'There is an AJAX error, revisit code.',
					success: function(a){
						a = a.query.results.item;
						//console.log(JSON.stringify(a));
						$.each(a, function(i,item){
							if(i < o.numResults){
								// Set permalink
								var perma = item.link;
								// Parse the `content`
								var content = $($.parseHTML(item.description));
								var hasMedia = item.thumbnail;
								// Set thumbnails
								if(hasMedia){
									var thumb = "'" + item.thumbnail[1].url + "'";
								} else {
									var thumb = o.noThumb;
								}
								// Build HTML
								var link = 'href="'+perma+'"';
								var html = '<li class="feed-image-wrapper"><a '+link+' target="'+newWindow+'"><div class="feed-image" style="background-image: url('+thumb+')"></div></a></li>';
							}
							// Add feed items to stream
							$('#'+o.deviantartHook+'-stream',el).append(html);
						});
					},
					complete: function(){
					}
				});
			}
	/* Depricated
	// Dribbble Feed
			if(!o.dribbbleID == ''){
				var url = '//api.dribbble.com/players/'+o.dribbbleID+'/shots?per_page='+o.numResults+'&callback=?';
					
				// Add ul tag to target element
				$('#'+o.dribbbleHook).append('<ul id="'+o.dribbbleHook+'-stream"></ul>');
				// jQuery AJAX call
				jQuery.ajax({
					url: url,
					cache: true,
					dataType: 'json',
					error: 'There is an AJAX error, revisit code.',
					success: function(a){
						a = a.shots;
						$.each(a, function(i,item){
							if(i < o.numResults){
								// Set permalink
								var perma = item.url;
								// Parse the `content`
								var content = $($.parseHTML(item.content));
								// Set thumbnails
								var thumb = item.image_teaser_url;
								var link = 'href="'+perma+'"';
								var html = '<li class="feed-image-wrapper"><a '+link+' target="'+newWindow+'"><div class="feed-image" style="background-image: url('+thumb+')"></div></a></li>';
							}
							// Add feed items to stream
							$('#'+o.dribbbleHook+'-stream',el).append(html);
						});
					},
					complete: function(a){
					}
				});
			} */
	// Behance Feed
			if(!o.behanceID == ''){
				var href = 'https://www.behance.net/'+o.behanceID+'.xml',
					url = '//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22'+ encodeURIComponent(href) +'%22%20limit%20'+ o.numResults +'&format=json&callback=?'
					//url = '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+o.numResults+'&callback=?&q='+encodeURIComponent(href);
					
				// Add ul tag to target element
				$('#'+o.behanceHook).append('<ul id="'+o.behanceHook+'-stream"></ul>');
				
				// jQuery AJAX call
				jQuery.ajax({
					url: url,
					cache: true,
					dataType: 'jsonp',
					error: 'There is an AJAX error, revisit code.',
					success: function(a){
						a = a.query.results.item;
						console.log(a)
						$.each(a, function(i,item){
							if(i < o.numResults){
								// Set permalink
								var perma = item.link;
								// Parse the `content`
								var content = $($.parseHTML(item.description));
								// Set thumbnails
								var thumb = $(content).attr('src');
								// Build HTML
								var link = 'href="'+perma+'"';
								var html = '<li class="feed-image-wrapper"><a '+link+' target="'+newWindow+'"><div class="feed-image" style="background-image: url('+thumb+')"></div></a></li>';
							}
							// Add feed items to stream
							$('#'+o.behanceHook+'-stream',el).append(html);
						});
					},
					complete: function(a){
					}
				});
			}
		}
	});
	
	$.fn.SIF = function(options, callback){
		var d = {};
		this.each(function(){
			var s = $(this);
			d = s.data("sif");
			if (!d){
				d = new SIFO(this, options, callback);
				s.data("sif", d);
			}
		});
		return d;
	};
	
})(jQuery);
