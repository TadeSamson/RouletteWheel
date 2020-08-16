var self;
export default class rouletteWheel{
    wheel;
    colors=[];
    centerX;
    centerY;
    outerThinGrayCircleRadius=0;
    outerBoldWhiteCircleRadius=0;
    outerThinGrayCircleThickness=0;
    outerBoldWhiteCircleThickness=0;
    outerThinWhiteCircleThickness=0;
    centreWhiteBallRadius=0;
    outerThinWhiteCircleRadius=0;
    centreOrangeBallRadius=0;
    innerThinOrangeCircleRadius=0;
    centreThinWhiteCircleRadius=0;
    segmentBallRadius=0;
    allImageLoaded=false;
    pointerPadding=0;
    randomizeWin;


    onAnimationStop;
    currentDrawAngle=0;

    option = null;

    spinDirection={
        clockwise:1,
        antiClockwise:-1
    }

    wheelContext;
    colorObject={
      loginOrange:'#dc6818',
      rouletteYellow:'#FCA511',
      rouletteOrange:'#F54E1E',
      rouletteOuterWhite:'#ffff',
      rouletteGray:'#8E7F7F',
      rouletteBlue:'#0996F2',
      rouletteGreen:'#1AEB8F'
    };

    constructor(_option){
       //passed the pointer image to draw 
       //loaded image could also be passed using the imageData property
       this._initializeOption(_option);
       this.easeFunction = this._getEaseFunction(this.option.animation.easing);
    }

    initializeWheel(){
      this._refineSpinRewards();
      this.randomizeWin= (typeof this.option.winSegment==="undefined")?true:false;
      this.wheel = document.getElementById(this.option.canvasId);
      this.wheel.addEventListener('touchstart',this._onTouchStart,false);
      this.wheel.addEventListener('touchmove',this._onTouchMove,false);
      this.wheel.addEventListener('touchend',this._onTouchEnd,false);
      this.centerX=this.wheel.width/2;
      this.centerY=this.wheel.height/2;
      this.wheelContext = this.wheel.getContext('2d');
      this._configureSizes();
      this._drawRoulette(0);
      this._loadWheelImages();
    }

    _drawRoulette(drawAngle){
      drawAngle=drawAngle+this.currentDrawAngle;
      this._clearCanvas();
      this.wheelContext.save();
      this._rotateCanvas(drawAngle);
      this._drawOuterGrayCircle();
      this._drawOuterWhiteCircle();
      this._drawSegments();
      this._drawOuterThinWhiteCircle();
      this._drawCentreWhiteBall();
      this._drawCentreOrangeBall();
      this._drawCentreThinWhiteCircle();
      this._drawInnerThinOrangeCircle();
      this.wheelContext.restore();
      this._drawPointer();
    }

    _initializeOption(_option){
        _option=_option?_option:{};
        this.option={
            spinRewards:_option.spinRewards,
            drawText:(typeof _option.drawText==="undefined")?true:_option.drawText,
            drawImage:(typeof _option.drawImage==="undefined")?true:_option.drawImage,
            winSegment:_option.winSegment,
            canvasId:_option.canvasId?_option.canvasId:'canvas',
            pointer:this._getInitializedPointer(_option.pointer),
            spinDirection:this._resolveSpinDirection(_option.spinDirection),
            animation:this._getInitializedAnimation(_option.animation),
            outerThinGrayCircleColor:_option.outerThinGrayCircleColor?_option.outerThinGrayCircleColor:this.colorObject.rouletteGray,
            outerBoldWhiteCircleColor:_option.outerBoldWhiteCircleColor?_option.outerBoldWhiteCircleColor:this.colorObject.rouletteOuterWhite,
            outerThinWhiteCircleColor:_option.outerThinWhiteCircleColor?_option.outerThinWhiteCircleColor:this.colorObject.rouletteOuterWhite,
            centreWhiteBallColor:_option.centreWhiteBallColor?_option.centreWhiteBallColor:this.colorObject.rouletteOuterWhite,
            centreOrangeBallColor:_option.centreOrangeBallColor?_option.centreOrangeBallColor:this.colorObject.loginOrange,
            innerThinOrangeCircleColor:_option.innerThinOrangeCircleColor?_option.innerThinOrangeCircleColor:this.colorObject.loginOrange,
            centreThinWhiteCircleColor:_option.centreThinWhiteCircleColor?_option.centreThinWhiteCircleColor:this.colorObject.rouletteOuterWhite,
            segmentBallColor:_option.segmentBallColor?_option.segmentBallColor:this.colorObject.rouletteOuterWhite,
            segmentLineColor:_option.segmentLineColor?_option.segmentLineColor:this.colorObject.rouletteOuterWhite
        }

    }

    _resolveSpinDirection(_stringDirection){
        _stringDirection=_stringDirection?_stringDirection.trim().toLowerCase():_stringDirection;
        if(_stringDirection==="anti-clockwise")
        return this.spinDirection.antiClockwise;
        else 
        return this.spinDirection.clockwise;
    }

    _getInitializedPointer(_pointer){
        _pointer=_pointer?_pointer:{};
        var pointer={
            image:_pointer.image?_pointer.image:null,
            degree:(typeof _pointer.degree==="undefined")?270:_pointer.degree
        }
        return pointer;
    }

    _getInitializedAnimation(_animation){
        _animation=_animation?_animation:{};
        var animation={
            duration:_animation.duration=="infinite"?5000:_animation.duration,
            alterableDuration:_animation.duration=="infinite"?5000:_animation.duration,
            easing: (typeof _animation.easing==="undefined")?'easeInOut':_animation.easing,
            isInfiniteDuration:_animation.duration=="infinite"?true:false,
            /// This, together with the animation duration basically controls the speed of the rotation. 
            /// (In degree). The more the rotationPerSecond, the faster the rotation.
            rotationPerSecond:(typeof _animation.rotationPerSecond==="undefined")?360:_animation.rotationPerSecond
        }

        return animation;
    }

    _refineSpinRewards(){
      var totalDegree =0;
     this.option.spinRewards.forEach(reward=>totalDegree=totalDegree+reward.degree);
      this.option.spinRewards.forEach((reward,index)=>{
        if (this.colors.length == 0) {
          this.colors = [
            this.colorObject.loginOrange,
            this.colorObject.rouletteYellow,
            this.colorObject.rouletteGray,
            this.colorObject.rouletteOrange,
            this.colorObject.rouletteBlue,
            this.colorObject.rouletteGreen]
      }
      if(reward.winSegment){
         this.option.winSegment= index;
      }
      var colorIndex=  Math.floor(Math.random()*this.colors.length);
      reward.fillStyle=reward.fillStyle?reward.fillStyle:this.colors[colorIndex];
      reward.degree= (reward.degree/totalDegree)*360;
      this.colors.splice(colorIndex,1);
      });
    }

    _loadWheelImages(){
      if(!this.option.drawImage)
      return;
      this.option.spinRewards.forEach(reward=>{
        if(reward.image){
          this._preloadImage(reward.image,(img)=>{
            reward.imageData=img;
            this._tryDrawImageWheel();
          })
      }
      })
       
    }

    _tryDrawImageWheel(){
      this.allImageLoaded = this.option.spinRewards.every(sr=>sr.imageData);
      if(this.allImageLoaded && this.option.drawImage){
          this._drawRoulette(0);
      }
    }


    _configureSizes(){
      //this.pointerPadding= this.wheel.width/30;
      this.outerThinGrayCircleThickness = 0.5;
      this.outerBoldWhiteCircleThickness = this.wheel.width/20;
      this.outerThinWhiteCircleThickness = 1;
      this.outerThinGrayCircleRadius = this.centerX-this.pointerPadding;
      var distanceAwayFromOuterWhite = this.wheel.width/25;
      this.outerThinWhiteCircleRadius = this.centerX-(this.outerThinGrayCircleThickness+this.outerBoldWhiteCircleThickness+distanceAwayFromOuterWhite+this.outerThinWhiteCircleThickness);
      this.outerBoldWhiteCircleRadius= this.outerThinGrayCircleRadius - (this.outerThinGrayCircleThickness+(this.outerBoldWhiteCircleThickness/2));
      this.centreWhiteBallRadius= this.wheel.width/11;
      this.centreOrangeBallRadius= this.wheel.width/20;
      this.innerThinOrangeCircleRadius = this.wheel.width/14;
      this.centreThinWhiteCircleRadius= this.wheel.width/7;
      this.segmentBallRadius= this.wheel.width/75;
    }

    _drawOuterGrayCircle(){
       this.wheelContext.beginPath();
       var startAngle =0;
       var endAngle = this._degreeToRadian(360);
       this.wheelContext.arc(this.centerX,this.centerY,this.outerThinGrayCircleRadius,startAngle,endAngle,false);
       this.wheelContext.lineWidth= this.outerThinGrayCircleThickness;
       this.wheelContext.strokeStyle= this.option.outerThinGrayCircleColor;
       this.wheelContext.stroke();
    }


    _drawOuterWhiteCircle(){
      this.wheelContext.beginPath();
      var startAngle =0;
      var endAngle = this._degreeToRadian(360);
      this.wheelContext.arc(this.centerX,this.centerY,this.outerBoldWhiteCircleRadius,startAngle,endAngle,false);
      this.wheelContext.lineWidth= this.outerBoldWhiteCircleThickness;
      this.wheelContext.strokeStyle=this.option.outerBoldWhiteCircleColor;
      this.wheelContext.stroke();
   }

   _drawOuterThinWhiteCircle(){
    this.wheelContext.beginPath();
    var startAngle =0;
    var endAngle = this._degreeToRadian(360);
    this.wheelContext.arc(this.centerX,this.centerY,this.outerThinWhiteCircleRadius,startAngle,endAngle,false);
    this.wheelContext.lineWidth= this.outerThinWhiteCircleThickness;
    this.wheelContext.strokeStyle= this.option.outerThinWhiteCircleColor;
    this.wheelContext.stroke();
 }

 _drawCentreWhiteBall(){
  this.wheelContext.beginPath();
  //this.wheelContext.moveTo(this.centerX,this.centerY);
  var startAngle =0
  var endAngle = this._degreeToRadian(360);
  this.wheelContext.arc(this.centerX,this.centerY,this.centreWhiteBallRadius,startAngle,endAngle,false);
  this.wheelContext.fillStyle= this.option.centreWhiteBallColor;
  this.wheelContext.fill();
 }

 _drawInnerThinOrangeCircle(){
  this.wheelContext.beginPath();
  //this.wheelContext.moveTo(this.centerX,this.centerY);
 
  var startAngle =0
  var endAngle = this._degreeToRadian(360);
  this.wheelContext.arc(this.centerX,this.centerY,this.innerThinOrangeCircleRadius,startAngle,endAngle,false);
  this.wheelContext.lineWidth=this.wheel.width/300;
  this.wheelContext.strokeStyle= this.option.innerThinOrangeCircleColor;
  this.wheelContext.stroke();
 }

 
 _drawCentreOrangeBall(){
  this.wheelContext.beginPath();
  //this.wheelContext.moveTo(this.centerX,this.centerY);
  
  var startAngle =0
  var endAngle = this._degreeToRadian(360);
  this.wheelContext.arc(this.centerX,this.centerY,this.centreOrangeBallRadius,startAngle,endAngle,false);
  this.wheelContext.fillStyle= this.option.centreOrangeBallColor;
  this.wheelContext.fill();
 }

 _drawCentreThinWhiteCircle(){
  this.wheelContext.beginPath();
  //this.wheelContext.moveTo(this.centerX,this.centerY);
  var startAngle =0
  var endAngle = this._degreeToRadian(360);
  this.wheelContext.arc(this.centerX,this.centerY,this.centreThinWhiteCircleRadius,startAngle,endAngle,false);
  this.wheelContext.lineWidth=1;
  this.wheelContext.strokeStyle= this.option.centreThinWhiteCircleColor;
  this.wheelContext.stroke();
 }

 _drawSegmentBall(){
  this.wheelContext.beginPath();
  this.wheelContext.moveTo(this.centerX,this.centerY);
  var startAngle =0;
  var endAngle = this._degreeToRadian(360);
  var centerX= (this.centerX + this.outerThinWhiteCircleRadius)-(this.outerThinWhiteCircleThickness/2);
  var centerY = this.centerY;
  this.wheelContext.arc(centerX,centerY,this.segmentBallRadius,startAngle,endAngle,false);
  this.wheelContext.fillStyle= this.option.segmentBallColor;
  this.wheelContext.fill();
 }

 _drawSegmentLine(){
  this.wheelContext.beginPath();
  this.wheelContext.moveTo(this.centerX,this.centerY);
  var positionX= this.wheel.width-(this.outerThinGrayCircleThickness+this.outerBoldWhiteCircleThickness);
  var positionY=this.centerY;
  this.wheelContext.lineTo(positionX,positionY);
  this.wheelContext.lineWidth=this.wheel.width/120;
  this.wheelContext.strokeStyle=this.option.segmentLineColor;
  this.wheelContext.stroke();
 }


 // pointer is drawn based on the user specified pointer degree property. 
 // if pointer degree is not set, default value is used. 
    _drawPointer() {
            if (this.option.pointer && this.option.pointer.image && !this.option.pointer.imageData) {
                this._preloadImage(this.option.pointer.image, (img) => 
                { 
                    this.option.pointer.imageData = img; 
                    this._drawPointer() 
                });
            }
            else if(this.option.pointer && this.option.pointer.imageData) {
                this.option.pointer.degree=  (typeof this.option.pointer.degree==="undefined")?270:this.option.pointer.degree;
                this.option.pointer.degree=this.option.pointer.degree%360;
                var widthHeight = this._scaleImageToDimension(50, this.option.pointer.imageData);

                //calculating xCorner and yCorner at 270 degree point on the wheel.
                var xCorner = (this.centerX - (widthHeight.width / 2));
                var yCorner = this.centerY - this.outerThinGrayCircleRadius;
                
                
                // A temporary rotation is needed to put the canvas at a convenient angle to draw the pointer
                                
                this.wheelContext.save();
                //we want to always draw the pointer at 270 degree for conveniency sake.
                //but the pointer location may not always be at 270 degree. 
                //we need to bring it to 270 degree, draw and then take back to initial position
                //since positive rotation is anti-clockwise, all we need is add 90 to the pointer degree
                //to take it to desire pointer degree. When done, we restore context back. 
                var trueDegree=this.option.pointer.degree+90;
                this._rotateCanvas(trueDegree*this.option.spinDirection);
                this.wheelContext.drawImage(this.option.pointer.imageData, xCorner, yCorner, widthHeight.width, widthHeight.height);
                this.wheelContext.restore();
            }

    }


 //scales image to specific size by adjusting height and width based on the dimensionToUse. 
 _scaleImageToDimension(dimensionToUse, image){
  var widthRatio= image.width/image.height;
  var heightRatio= image.height/image.width;
  var height=image.height>image.width?dimensionToUse: Math.round(heightRatio*dimensionToUse);
  var width= image.width>image.height?dimensionToUse:  Math.round(widthRatio*dimensionToUse);
  return {width,height}
}

 _drawRewardImage(reward){
   if(this.allImageLoaded){
    var dimensionToUse= this.wheel.width<this.wheel.height?this.wheel.width:this.wheel.height;
    //weight is necessary in case segment isn't even. If so, image in them shouldn't be even too. 
    var weight = (reward.degree*this.option.spinRewards.length)/360;
    
    dimensionToUse= (dimensionToUse/this.option.spinRewards.length)*weight;

    var widthHeight= this._scaleImageToDimension(dimensionToUse,reward.imageData);
    var allowedWidth=widthHeight.width;
    var allowedHeight=widthHeight.height;
    var halfHeight= allowedHeight/2;
    var halfWidth= allowedWidth/2;

    var xCorner = (this.centerX + (this.outerThinGrayCircleRadius / 2))-halfWidth;
    var yCorner = this.centerY-halfHeight;
    
    this.wheelContext.drawImage(reward.imageData,xCorner,yCorner,widthHeight.width,widthHeight.height);
   }

 }
 

 _drawSegments(){
    var currentAngle=0;
    this.option.spinRewards.forEach(reward=>{ 
      this.wheelContext.beginPath();
      this.wheelContext.moveTo(this.centerX,this.centerY);
      var radius= this.centerX - (this.outerThinGrayCircleThickness+this.outerBoldWhiteCircleThickness)
      var startAngle =this._degreeToRadian(currentAngle);
      currentAngle=currentAngle+reward.degree;
      var endAngle = this._degreeToRadian(currentAngle);
      this.wheelContext.arc(this.centerX,this.centerY,radius,startAngle,endAngle,false);
      this.wheelContext.fillStyle= reward.fillStyle;
      this.wheelContext.fill();
      this.wheelContext.save();

      this._rotateCanvas((currentAngle-reward.degree),true);
      this._drawSegmentLine();
      this._drawSegmentBall();
      this._rotateCanvas(reward.degree/2,true);
      this._drawRewardImage(reward);
      this.wheelContext.restore();
    });

    // this helps to redraw first slice line because it will be partially covered by the last splice
    this._drawSegmentLine();
    this._drawSegmentBall();

 }



    //arc is drawn in radian with the canvas but it's appear more human working with degree. 
    //this nugget converts our degree to their radian. 
    //1PI radian = 180 degree. 
    _degreeToRadian(degree){
        var radian = (Math.PI*degree)/180;
        return radian;
    }

    _rotateCanvas(degree,ensurePositive){
        if(ensurePositive!==true)
      degree=degree*this.option.spinDirection;
      this.wheelContext.translate(this.centerX,this.centerY);
      var radian = this._degreeToRadian(degree);
      this.wheelContext.rotate(radian);
      this.wheelContext.translate(-this.centerX,-this.centerY);
    }


     _preloadImage(imageUrl,callback){
        if(imageUrl)
        {
            var img = new Image();
            img.src = imageUrl;
            img.onload = () => {
              callback(img);
            }; 
        }
      }

      _clearCanvas(){
        this.wheelContext.clearRect(0, 0, this.wheel.width, this.wheel.height);
      }


    

      /// This section down deals with the small animation library for the rouletteWheel. 

      animationHandle;

      
      /// use to keep the start time of the animation when window.requestAnimationFrame() is called
      /// the first time. This basically keeps track of duration progress of the animation
      animationStartTimeInMilli;


      /// The animation ease effect function based on user animation ease property
      easeFunction;
      /// use to calculate where the current animation will stop in degree
      stopRotation;
      /// use to keep the state of the rotation relative to stopRotation. This variable allows the wheel to 
      /// resume a smooth animation if user stops the wheel before duration complete. (check usage in _startRotation function)
      currentRotation;

      


      //use to prevent multiple call to _startAnimation when animation is already running
      spinActive=false;

      setSpinDuration(duration){
        duration = duration=="infinite"?5000:duration;
         if(this.option.spinActive)
         {
         this.option.animation.alterableDuration=this.option.animation.alterableDuration+duration;
         }
         else
         {
         this.option.animation.alterableDuration=duration;
         }
         this.easeFunction = this._getEaseFunction(this.option.animation.easing);
         this.option.animation.duration=duration;
         this.option.animation.isInfiniteDuration = duration=="infinite"?true:false;
      }
      
      setWinSegment(segment){
        this.option.winSegment = segment;
        if(this.spinActive)
        {
          this.stopRotation = this._adjustStopRotationToWinSegment(this.stopRotation);
        }
      }


      _getDurationRotation(durationInMilli){
          return this.option.animation.rotationPerSecond*(durationInMilli/1000);
        }

      startAnimation(){
          if(!this.spinActive){
           this.spinActive=true;
           this.easeFunction=this._getEaseFunction(this.option.animation.easing);
           this.stopRotation= this._getDurationRotation(this.option.animation.duration);
           this.option.animation.alterableDuration=this.option.animation.duration;
           this.stopRotation=this._adjustStopRotationToWinSegment(this.stopRotation);
           this.animationStartTimeInMilli = performance.now();
           self=this;
           this.animationHandle = requestAnimationFrame(this.animate);
          }
      }

      stopAnimation(){
          if(this.spinActive && !self.option.animation.isInfiniteDuration)
          return;
          this.spinActive=false;
          cancelAnimationFrame(this.animationHandle);
          if(this.option.animation.isInfiniteDuration){
              var degree=this._getARandomLocationInASegment(this.option.winSegment);
              
              degree= this.option.spinDirection==this.spinDirection.clockwise?360-degree:degree; //adjust the degree based on the wheel spin direction.
             
              degree=this.option.spinDirection==this.spinDirection.clockwise?degree+this.option.pointer.degree:degree-this.option.pointer.degree; //This is necessary to make the reward land on the actual pointer location.

              degree= degree-(this.currentDrawAngle%360);
              this._drawRoulette(degree);

              /// make the currentDrawAngle the stopAngle so rotation can start there when re-spinning.
              this.currentDrawAngle=this.currentDrawAngle+degree;
          }
          else{
            this.currentDrawAngle=this.currentDrawAngle+this.currentRotation;
          }
          if(this.onAnimationStop){

            this.onAnimationStop(this.option.spinRewards[this.option.winSegment]);
        }
      }

      // use to ensure the wheel final stop always fall at the winSegment slice.
      _adjustStopRotationToWinSegment(_stopRotation){
         if(this.randomizeWin){
            this.option.winSegment=  Math.floor(Math.random()*this.option.spinRewards.length);
         }
         
         var winAngle= this._getARandomLocationInASegment(this.option.winSegment);


         //depending on the direction of spin, the true win angle needs to be adjusted accordingly.
         //to stop at the win segment say segment 4 (0 base), we need to consider the fact that when the wheel spins in a direction,
         //say clickwise, it actually needs to stop in segment segments.length-4 because it's spining against
         //the position of the segments. 
         var adjustAntiClockwise = 360-winAngle;
         var winAngle= this.option.spinDirection==this.spinDirection.clockwise?adjustAntiClockwise:winAngle;

         
         var stopAngle = _stopRotation%360; //strip out complete revolution because we only need the excess degree that doesn't make a full rotation
         var diff = stopAngle-winAngle;
         
         stopAngle=stopAngle - diff; // this is the true stop angle;
         

         stopAngle=this.option.spinDirection==this.spinDirection.clockwise?stopAngle+this.option.pointer.degree:stopAngle-this.option.pointer.degree; //This is necessary to make the reward land on the actual pointer location.

         
         _stopRotation= (Math.floor(_stopRotation/360)*360)+stopAngle; //set back the initial stripped revolution and add the stopAngle
         _stopRotation=_stopRotation- (this.currentDrawAngle%360); //consider the currentDrawingAngle of the wheel
         return _stopRotation;

      }


      _getARandomLocationInASegment(segmentIndex){
        if(segmentIndex>=this.option.spinRewards.length)
        return 0;
                 
        var i;
         var segmentAngle=0;
        for(i=0; i<= segmentIndex; i++){
         segmentAngle=segmentAngle + this.option.spinRewards[i].degree;
        }
        var plusOrMinus = Math.random()*1>0.5?-1:1;
        var randomLocationInSegment= Math.floor(Math.random()*(this.option.spinRewards[segmentIndex].degree/2));     
        var segmentCentre= segmentAngle-(this.option.spinRewards[segmentIndex].degree/2);
        var randomSegmentAngle= segmentCentre+(randomLocationInSegment*plusOrMinus);
        return randomSegmentAngle;

   }

      animate(){
            var diff = performance.now() - self.animationStartTimeInMilli;
            var timeFraction = diff/self.option.animation.alterableDuration;
            timeFraction = self.easeFunction(timeFraction);

            timeFraction = timeFraction>1?1:timeFraction;
            self.currentRotation = self.stopRotation*timeFraction;
            self._drawRoulette((self.currentRotation)%360);

            if(diff<self.option.animation.alterableDuration){
                self.prevTimFraction=timeFraction;
                if(self.option.animation.isInfiniteDuration){
                    self.easeFunction=self._getEaseFunction('linear');
                    var extendedDuration = 1000;
                    self.option.animation.alterableDuration = self.option.animation.alterableDuration+extendedDuration;
                    var extendedRotation = self._getDurationRotation(extendedDuration);
                    self.stopRotation = self.stopRotation+ extendedRotation;
            }
               self.animationHandle = requestAnimationFrame(self.animate);
            }
            else{
                self.spinActive=false;
                self.stopAnimation();
            } 

      }

      _getEaseFunction(ease){
          ease = ease.trim().toLowerCase();
          switch(ease){
              case 'easeIn': return this._arcCurve;
              case 'easeout':return this._arcCurveEaseOut;
              case 'easeinout': return this._arcCurveEaseInOut;
              default: return this._linear;
          }
      }


       _linear(timeFraction){
           return timeFraction;
       }
      _arcCurve(timeFraction){
          return 1 - Math.sin(Math.acos(timeFraction));
      }

      _arcCurveEaseOut(timeFraction){
        return 1 - this._arcCurve(1 - timeFraction)
      }

      _arcCurveEaseInOut(timeFraction){
        if (timeFraction <= 0.5) { // first half of the animation
            return this._arcCurve(2 * timeFraction) / 2;
          } else { // second half of the animation
            return (2 - this._arcCurve(2 * (1 - timeFraction))) / 2;
          }

      }




      /// This section handles the Touch Listener for the plugin 

      _onTouchStart(e){
        e.preventDefault();
        var touch = e.touches[0];
      }

      _onTouchMove(e){
        e.preventDefault();
        var touch = e.touches[0];
        console.log(touch.pageX + " - " + touch.pageY);
      }

      _onTouchEnd(e){
        e.preventDefault();
        var touch = e.touches[0];
      }


}



//helpful resources : https://javascript.info/js-animation