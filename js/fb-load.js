// Load FB api by 
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

  for (var k = 0; k < list.length; k++) {
    likes[k] = list[k].likes
    message[k] = list[k].message
    created_time[k] = list[k].created_time
    story_url[k] = list[k].story_url
  }
  
  $(".sk-cube-grid").hide();
  var fb_content = document.getElementById("post-preview");
  for (var i = 0; i < likes.length; i++) {
    var author = getAuthor(message[i])
    message[i] = getMessage(message[i])
    fb_content.innerHTML += "<div id='content' data-toggle='modal' data-target='#content-modal' onclick='showModal("
                          + i
                          + ")'>"
                          + "<h2 class='post-title' style='font-family: Microsoft JhengHei'>" 
                          + "主顧榮譽書院劇場          " 
                          + "<img src='img/likes.jpg' width='4%'>" 
                          + likes[i] 
                          + "</h2>"
                          + "<pre>" 
                          + "<h3 class='post-subtitle' style='font-family: Microsoft JhengHei'>" 
                          + message[i].slice(0, 250)
                          + ((message[i].length >= 250) ? " ...\n\n<觀看全文>" : "")
                          + "</h3>" 
                          + "</pre>"
                          + "</div>" 
                          + "<p>Posted by <a href='#'> "
                          + author
                          + "</a>" 
                          + created_time[i].split("T")[0] 
                          + "</p>" + "<hr>"
    fb_content.style.opacity = 1 
    fb_content.style.top = 0;
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
      } else {
        likes.push(0)
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
      "fields": "likes.limit(100), message, created_time, id",
    }, getPosts
  );
}

function getAuthor(message) {
  var author = ""
  if (typeof(message) === 'undefined') {
    return "Angry Bird "
  }
  for (var i = message.length - 1; i >= message.length - 4; i--) {
    if (message[i] === '-') break;
    author = message[i] + author
  }
  if (message[message.length - 4] !== '-') 
    return "劇場小編 "
  else 
    return author + " "
}

function getMessage(message) {
  var content = ""
  if (typeof(message) === 'undefined') {
    return "Watch content on FB"
  }
  if (message[message.length - 4] !== '-')  {
    return message
  }
  else {
    var boo = false
    for (var i = message.length - 5; i >= 0; i--) {
      if (message[i] !== '-' && boo == false) {
        boo = true
        content = message[i] + content
      }
      if (boo == true)
        content = message[i] + content
    }
  }
  return content
}

function showModal(show_id) {
  console.log(message[show_id])
  document.getElementById("modal-body").innerHTML = message[show_id]
  document.getElementById("modal-story-url").href = story_url[show_id]          
}

