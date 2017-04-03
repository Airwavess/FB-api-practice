window.fbAsyncInit = function() {
  FB.init({
    appId: '250498388745988',
    xfbml: true,
    version: 'v2.8',
    status: 'connected'
  });
  FB.AppEvents.logPageView();
  getLoginStatus()
};
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'))


function showData() {

  var list = [];
  for (var i = 0; i < likes.length; i++)
    list.push({
      'likes': likes[i],
      'message': message[i],
      'created_time': created_time[i],
      'story_url': story_url[i]
    });

  list.sort(function(likes_1, likes_2) {
    return ((likes_1.likes > likes_2.likes) ? -1 : ((likes_1.likes == likes_2.likes) ? 0 : 1))
  });

  for (var k = 0; k < list.length; k++) {
    likes[k] = list[k].likes
    message[k] = list[k].message
    created_time[k] = list[k].created_time
    story_url[k] = list[k].story_url
  }
  $(".sk-cube-grid").hide();
  var fb_content = document.getElementById("post-preview")
  for (var i = 0; i < 5; i++) {
    var author = message[i].split("---")[1]
    message[i] = message[i].split("---")[0]
    fb_content.innerHTML += "<a href="
                          + story_url[i] 
                          + "><h2 class='post-title' style='font-family: Microsoft JhengHei'>" 
                          + "主顧榮譽書院劇場          " 
                          + "<img src='img/likes.jpg' width='4%'>" 
                          + likes[i] 
                          + "</h2>" 
                          + "<h3 class='post-subtitle' style='font-family: Microsoft JhengHei'>" 
                          + message[i] 
                          + "</h3>" 
                          + "</a>" 
                          + "<p class='post-meta'>Posted by <a href='#'> "
                          + (typeof(author) === 'undefined'? "不知道 " : author + "  ")
                          + "</a>" 
                          + created_time[i].split("T")[0] 
                          + "</p>" + "<hr>"
    fb_content.style.opacity = 1 
    fb_content.style.top = 0
  }

}

var likes = []
var message = []
var created_time = []
var story_url = []
var getPosts = function(response) {
  var myObj = response
  for (var i = 0; i < myObj.data.length; i++) {
    if (myObj.data[i] != null) {
      if (typeof(myObj.data[i].likes) !== "undefined") {
        likes.push(myObj.data[i].likes.data.length)
      }
      message.push(myObj.data[i].message)
      created_time.push(myObj.data[i].created_time)
      id = myObj.data[i].id.split("_")[1]
      story_url.push("https://www.facebook.com/permalink.php?story_fbid="+id+"&id=170659829952078")
    }
  }

  if (typeof(response.paging) === "undefined" || typeof(response.paging.next) === "undefined") {

    showData()
  } else {
    nextPage = response.paging.next
    FB.api(nextPage, getPosts)
  }
}


function getLoginStatus(response) {
  var accessToken = "EAADj07N6XwQBAPKnJXsLZAg6zjBwpYfEuucQAidkXrvBE8iqLi7qmBk1umCZC5T4LhPkVMQmJDLWusbZAQVOLF8uZBq4V5x9kSzR6i72r8p9UY1DF3TqzoXAY8Kou7pbuX35bqKmbKE154UC6I4DZBTc5trW2IKq97bNislWokAZDZD"
  FB.api(
    '/170659829952078/posts',
    'GET', {
      "access_token": accessToken,
      "limit": 100,
      "fields": "likes, message, created_time, id",
    }, getPosts
  );
}
