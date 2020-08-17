# RouletteWheel
A full customized light weight reward wheel plugin made with JavaScript with No additional library. 

## Demo 
The demo for this project can be found on my [static website](https://tadesamson.com/roulette.html)

## Motivation
I was basically motivated to write this for Quizac after searching different roulette plugin online and 
observing they all have 1 thing in common, multiple external libraries (animation libraries, sound libries), making the roulette itself
ridiculously heavy even for the paid ones. This being the complain of most developers using them, I set out
to write one with no external library and with a relatively small size to make developers happy. Here, I present to you my roulette adding 
just 16KB size to your project compare to about 554KB by similar plugins.

## Screenshots
![ScreenShot](https://tadesamson.com/img/roulette_screenshot.gif)


## Installation
npm install tadesamson-roulette

## Usage

> Javascript

```
var rewards:[{text:'SmartWatch', fillStyle:'#0996F2', image:'https://res.cloudinary.com/thribyte-technologies/image/upload/v1590590237/rewards/wheel/reward_wheel_smartwatch.png', degree:45 },
{text:'300 Coins', fillStyle:'#F54E1E', image:'https://res.cloudinary.com/thribyte-technologies/image/upload/v1590592103/rewards/wheel/reward_wheel_ticket3.png', degree:45 },
{text:'Blue TShirt', fillStyle:'#FCA511', image:'https://res.cloudinary.com/thribyte-technologies/image/upload/v1590599044/rewards/wheel/reward_wheel_shirt_blue.png', degree:45 },
{text:'Try Again', fillStyle:'#1AEB8F', image:'https://tadesamson.com/img/sad-emoji.png', degree:45 },
{text:'Try Again', fillStyle:'#1886F2', image:'https://tadesamson.com/img/sad-emoji.png', degree:45 },
{text:'500 Coins', fillStyle:'#8E7F7F', image:'https://res.cloudinary.com/thribyte-technologies/image/upload/v1590592103/rewards/wheel/reward_wheel_ticket4.png', degree:45 },
{text:'VR Box', fillStyle:'#dc6818', image:'https://res.cloudinary.com/thribyte-technologies/image/upload/v1590590237/rewards/wheel/reward_wheel_vr.png', degree:45 },
];
var option = {
spinRewards:rewards,
drawText:true,
drawImage:true,
pointer:{image:"https://tadesamson.com/img/pointer.png",degree:270},
spinDirection:'clockwise',
canvasId:'canvas',
animation:{duration:6000,rotationPerSecond:360,easing:'easeInOut'},
winSegment:undefined //can be any number in the segment
}



var roulette=new rouletteWheel(option);
roulette.onAnimationStop=(reward)=>{
$("#startSpin").html("SPIN");
alert(`Hehe! ${reward.text}`);
}
roulette.initializeWheel();
roulette.startAnimation();

```

> Html
```
<canvas id="canvas" style="display:none;">
</canvas>
```

## Credit
[https://www.html5canvastutorials.com](https://www.html5canvastutorials.com/tutorials) made this project possible
through their detail tutorial on html5 canvas.


## Care To Read More? 
[Read more on the implementation details on this paper article](https://paper.dropbox.com/doc/QuizacWheel.js-Documentation--A5zBWH6Vxb2jV50NF9rPDhXMAg-X2Y3MlZ8ItfTYI0ZHYs1l)





