
PImage emoji;

//emoji = emoji.resize(128,128);

public void setup(){
  String[] img = loadStrings("emojis.txt");
  if(img[0].contains(".png")){
    emoji = loadImage(img[0],"png");
  }else if(img[0].contains(".jpg")){
    emoji = loadImage(img[0],"jpg");
  }else{
    println("here");
    exit();
  }
  emoji.resize(128,128);
  size(128,128);
  image(emoji,0,0,128,128);
  save("emojis.png");
  exit();
  
}