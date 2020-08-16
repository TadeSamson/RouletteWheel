import pointerImage from '../../../../img/icons/reward_wheel_pointer2.png';
import rouletteWheel from './rouletteWheel.js';

export default class RewardWheel{

  colorObject={
    loginOrange:'#dc6818',
    rouletteYellow:'#FCA511',
    rouletteOrange:'#F54E1E',
    rouletteOuterWhite:'#ffff',
    rouletteGray:'#8E7F7F',
    rouletteBlue:'#0996F2',
    rouletteGreen:'#1AEB8F'
  }
   
  roulette;
  constructor(_spinRewards,_animationStopCallback){
    this.roulette=new rouletteWheel({ 
        spinRewards:_spinRewards, 
        drawText:true,
        drawImage:true,
        pointer:{image:pointerImage,degree:270},
        spinDirection:'clockwise',
        canvasId:'canvas',
        animation:{duration:6000,rotationPerSecond:360,easing:'easeInOut'},
        winSegment:4
      });
    this.roulette.onAnimationStop=_animationStopCallback;
  }

  show(){
    this.roulette.initializeWheel();
  }

  setDuration(duration){
    this.roulette.setSpinDuration(duration);
  }
  setWinSegment(winSegment){
    this.roulette.setWinSegment(winSegment);
  }

  startSpin(){
      this.roulette.startAnimation();
  }

  stopSpin(){
    this.roulette.stopAnimation();
  }

}