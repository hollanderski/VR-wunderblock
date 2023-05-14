( function () {

const _position = new THREE.Vector3();
const _quaternion =  new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _orientation = new THREE.Vector3();
var mypositionxyz =  new THREE.Vector3();

class PositionalAudio2 extends THREE.Audio {

	constructor( listener, myposition ) {

		super( listener );

		this.panner = this.context.createPanner();
		this.panner.setPosition(myposition.x, myposition.y, myposition.z);
		this.panner.panningModel = 'HRTF';
		this.panner.connect( this.gain );

		this.myposition = myposition;

		

	}



	disconnect() {

		super.disconnect();

		this.panner.disconnect( this.gain );

	}

	getOutput() {

		return this.panner;

	}

	getRefDistance() {

		return this.panner.refDistance;

	}

	setRefDistance( value ) {

		this.panner.refDistance = value;

		return this;

	}

	getRolloffFactor() {

		return this.panner.rolloffFactor;

	}

	setRolloffFactor( value ) {

		this.panner.rolloffFactor = value;

		return this;

	}

	getDistanceModel() {

		return this.panner.distanceModel;

	}

	setDistanceModel( value ) {

		this.panner.distanceModel = value;

		return this;

	}

	getMaxDistance() {

		return this.panner.maxDistance;

	}

	setMaxDistance( value ) {

		this.panner.maxDistance = value;

		return this;

	}

	setDirectionalCone( coneInnerAngle, coneOuterAngle, coneOuterGain ) {


		this.panner.coneInnerAngle = coneInnerAngle;
		this.panner.coneOuterAngle = coneOuterAngle;
		this.panner.coneOuterGain = coneOuterGain;

		return this;

	}

	updateMatrixWorld( force ) {

		//console.log(this.parent.geometry.attributes)
		//return


		super.updateMatrixWorld( force );

		if ( this.hasPlaybackControl === true && this.isPlaying === false ) return;

		//console.log(myposition)

		//this.matrixWorld.decompose( _position, _quaternion, _scale );

		this.matrixWorld.decompose( this.myposition, _quaternion, _scale );

		_orientation.set( 0, 0, 1 ).applyQuaternion( _quaternion );


		const panner = this.panner;



/*

		if ( panner.positionX ) {

			// code path for Chrome and Firefox (see #14393)

			const endTime = this.context.currentTime + this.listener.timeDelta;

			
			

			panner.positionX.linearRampToValueAtTime( this.myposition.x, endTime );
			panner.positionY.linearRampToValueAtTime( this.myposition.y, endTime );
			panner.positionZ.linearRampToValueAtTime( this.myposition.z, endTime );
			panner.orientationX.linearRampToValueAtTime( _orientation.x, endTime );
			panner.orientationY.linearRampToValueAtTime( _orientation.y, endTime );
			panner.orientationZ.linearRampToValueAtTime( _orientation.z, endTime );

			
			

		} else {

			panner.setPosition( this.myposition.x, this.myposition.y, this.myposition.z );
			panner.setOrientation( _orientation.x, _orientation.y, _orientation.z );

		}

		*/

	}

}

THREE.PositionalAudio2 = PositionalAudio2;

} )();

