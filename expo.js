'use strict'
// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
// const hidden = document.querySelector('.ds');
const containerWorkouts = document.querySelector('.workouts');
// const containerWorkout = document.querySelector('.workout');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
class Workout{
constructor(coords,duration,distance){
this.coords=coords;
this.duration=duration;
this.distance=distance;
};


}
class Running extends Workout {
    constructor(type,coords,duration,distance,cadence){
   super(coords,duration,distance);
    this.cadence=cadence;
    this.type=type;    
}
calcPace(){
    return this.distance/this.duration;
}

}


class Cycling extends Workout {
    constructor(type,coords,duration,distance,elevationGain){
   super(coords,duration,distance);
    this.elevationGain=elevationGain;    
   this.type=type;
}
calcPace(){
    return this.distance/this.duration;
}
}
class  App{
    
   
    #map;
    #mapEvent;

constructor(){
    this._getPosition();
    form.addEventListener('submit',this._newWorkout.bind(this));
    inputType.addEventListener('change',this._interchange)
}

_getPosition(){

    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){alert('thik se')});
   
    
}
_loadMap(position){
    const lat=position.coords.latitude;
    const long=position.coords.longitude;
    const arr=[lat ,long ];
    this.#map = L.map('map').setView(arr, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);

    this.#map.on('click',function(mapEvnt){
        form.classList.remove('hidden');
        this.#mapEvent=mapEvnt;    
     }.bind(this))
    //  this.#map.on('click',this._displayform.bind(this));

    }

_newWorkout(e){
    let workout;
    e.preventDefault();
    this.month=months[new Date().getMonth()];
    this.date=(new Date()).getDate();
    //get data from form
    // console.log(this.date);
    
    const {lat,lng}=this.#mapEvent.latlng;
        const brr=[lat,lng]
    //check data validity 
     if(inputCadence.value<0||inputDistance.value<0||inputDuration.value<0||inputElevation.value<0)
     {
        alert('Input values should be positive');
     }
     else{
    //if workout ,create workout object
     if(inputType.value=='running')
    {    workout=new Running('run',brr,inputDuration.value,inputDistance.value,inputCadence.value);
         this.event='🏃‍♂️Running on '+this.month+' '+this.date;
    }
        //if running create running object
    else{
        workout=new Cycling('cycle',brr,inputDuration.value,inputDistance.value,inputElevation.value);
         this.event='🚴‍♀️Cycling on '+this.month+' '+this.date;
    }   
    
    //render this data on map
    L.marker(brr).addTo(this.#map)
        .bindPopup(L.popup({
            maxwidth:250,
            minwidth:100,
            autoClose:false,
            closeOnClick:false,
                })).setPopupContent(this.event)
        .openPopup(); 
    //render this data as block
     this._renderBlock(workout);
    
     //hide the form
     this._hideform(workout);
            }
    
}
_hideform(workout){
    inputCadence.value=inputDistance.value=inputDuration.value=inputElevation.value='';
    form.style.display='none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 2000);
    
    
}
_renderBlock(workout){
    
     let html=`<li class="workout workout--running" data-id="1234567890">
     <h2 class="workout__title">${this.event}</h2>
     <div class="workout__details">
     <span class="workout__icon">${workout.type=='run'?'🏃‍♂️':'🚴‍♀️'}</span>
     <span class="workout__value">${workout.distance}</span>
     <span class="workout__unit">km</span>
   </div>  
     <div class="workout__details">
       <span class="workout__icon">⏱</span>
       <span class="workout__value">${workout.duration}</span>
       <span class="workout__unit">min</span>
     </div>
     <div class="workout__details">
     <span class="workout__icon">⚡️</span>
     <span class="workout__value">${workout.calcPace()}</span>
     <span class="workout__unit">km/min</span>
   </div>
     `;
     if(workout.type=='run')
     {
        html+=`   
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>`
     }
     else
     {
        html+=`   
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.elevationGain}</span>
        <span class="workout__unit">spm</span>
      </div>`
     }
     html+=`<\li>`;
     form.insertAdjacentHTML('afterend',html);
}
_interchange(){
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    
}

};
//getting postion and using geolocation API
 const myapp=new App();

// display form on click on map

// change between cadence and elevation

