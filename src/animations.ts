import { Animation } from './animator.js';

export const PUNCH_ANIMATION: Animation = {
  name: 'Punch',
  duration: 1.0,
  loop: false,
  keyframes: [
    {
      time: 0,
      params: {
        torsoAngle: 0,
        leftShoulderAngle: Math.PI / 4,
        leftElbowAngle: Math.PI / 6,
        rightShoulderAngle: -Math.PI / 4,
        rightElbowAngle: -Math.PI / 6,
        leftHipAngle: Math.PI / 8,
        rightHipAngle: -Math.PI / 8
      }
    },
    {
      time: 0.2,
      params: {
        torsoAngle: -Math.PI / 12,
        leftShoulderAngle: Math.PI / 3,
        leftElbowAngle: Math.PI / 4,
        rightShoulderAngle: -Math.PI / 2,
        rightElbowAngle: -Math.PI / 3,
        leftHipAngle: Math.PI / 6,
        rightHipAngle: -Math.PI / 12
      }
    },
    {
      time: 0.4,
      params: {
        torsoAngle: Math.PI / 16,
        leftShoulderAngle: Math.PI / 4,
        leftElbowAngle: Math.PI / 8,
        rightShoulderAngle: 0,
        rightElbowAngle: 0,
        leftHipAngle: Math.PI / 12,
        rightHipAngle: -Math.PI / 6
      }
    },
    {
      time: 0.7,
      params: {
        torsoAngle: 0,
        leftShoulderAngle: Math.PI / 4,
        leftElbowAngle: Math.PI / 6,
        rightShoulderAngle: -Math.PI / 6,
        rightElbowAngle: -Math.PI / 8,
        leftHipAngle: Math.PI / 8,
        rightHipAngle: -Math.PI / 8
      }
    },
    {
      time: 1.0,
      params: {
        torsoAngle: 0,
        leftShoulderAngle: Math.PI / 4,
        leftElbowAngle: Math.PI / 6,
        rightShoulderAngle: -Math.PI / 4,
        rightElbowAngle: -Math.PI / 6,
        leftHipAngle: Math.PI / 8,
        rightHipAngle: -Math.PI / 8
      }
    }
  ]
};

export const GET_HIT_ANIMATION: Animation = {
  name: 'Get Hit',
  duration: 1.2,
  loop: false,
  keyframes: [
    {
      time: 0,
      params: {
        x: 400,
        torsoAngle: 0,
        headTilt: 0,
        leftShoulderAngle: Math.PI / 4,
        leftElbowAngle: Math.PI / 6,
        rightShoulderAngle: -Math.PI / 4,
        rightElbowAngle: -Math.PI / 6,
        leftHipAngle: Math.PI / 8,
        rightHipAngle: -Math.PI / 8
      }
    },
    {
      time: 0.1,
      params: {
        x: 420,
        torsoAngle: -Math.PI / 8,
        headTilt: -Math.PI / 6,
        leftShoulderAngle: -Math.PI / 6,
        leftElbowAngle: Math.PI / 4,
        rightShoulderAngle: -Math.PI / 3,
        rightElbowAngle: Math.PI / 4,
        leftHipAngle: Math.PI / 6,
        rightHipAngle: -Math.PI / 12
      }
    },
    {
      time: 0.3,
      params: {
        x: 450,
        torsoAngle: -Math.PI / 6,
        headTilt: -Math.PI / 4,
        leftShoulderAngle: -Math.PI / 4,
        leftElbowAngle: Math.PI / 3,
        rightShoulderAngle: -Math.PI / 2,
        rightElbowAngle: Math.PI / 3,
        leftHipAngle: Math.PI / 4,
        rightHipAngle: 0
      }
    },
    {
      time: 0.6,
      params: {
        x: 460,
        torsoAngle: -Math.PI / 12,
        headTilt: -Math.PI / 8,
        leftShoulderAngle: -Math.PI / 8,
        leftElbowAngle: Math.PI / 6,
        rightShoulderAngle: -Math.PI / 3,
        rightElbowAngle: Math.PI / 6,
        leftHipAngle: Math.PI / 6,
        rightHipAngle: -Math.PI / 16
      }
    },
    {
      time: 1.2,
      params: {
        x: 460,
        torsoAngle: 0,
        headTilt: 0,
        leftShoulderAngle: Math.PI / 4,
        leftElbowAngle: Math.PI / 6,
        rightShoulderAngle: -Math.PI / 4,
        rightElbowAngle: -Math.PI / 6,
        leftHipAngle: Math.PI / 8,
        rightHipAngle: -Math.PI / 8
      }
    }
  ]
};

export const DIE_ANIMATION: Animation = {
  name: 'Die',
  duration: 2.5,
  loop: false,
  keyframes: [
    {
      time: 0,
      params: {
        y: 300,
        torsoAngle: 0,
        headTilt: 0,
        leftShoulderAngle: Math.PI / 4,
        leftElbowAngle: Math.PI / 6,
        rightShoulderAngle: -Math.PI / 4,
        rightElbowAngle: -Math.PI / 6,
        leftHipAngle: Math.PI / 8,
        leftKneeAngle: Math.PI / 12,
        rightHipAngle: -Math.PI / 8,
        rightKneeAngle: -Math.PI / 12
      }
    },
    {
      time: 0.3,
      params: {
        y: 300,
        torsoAngle: -Math.PI / 6,
        headTilt: -Math.PI / 4,
        leftShoulderAngle: -Math.PI / 3,
        leftElbowAngle: Math.PI / 4,
        rightShoulderAngle: -Math.PI / 2,
        rightElbowAngle: Math.PI / 3,
        leftHipAngle: Math.PI / 6,
        leftKneeAngle: Math.PI / 8,
        rightHipAngle: -Math.PI / 12,
        rightKneeAngle: -Math.PI / 16
      }
    },
    {
      time: 0.7,
      params: {
        y: 320,
        torsoAngle: -Math.PI / 3,
        headTilt: -Math.PI / 3,
        leftShoulderAngle: -Math.PI / 2,
        leftElbowAngle: Math.PI / 3,
        rightShoulderAngle: -Math.PI / 1.5,
        rightElbowAngle: Math.PI / 2,
        leftHipAngle: Math.PI / 4,
        leftKneeAngle: Math.PI / 4,
        rightHipAngle: Math.PI / 8,
        rightKneeAngle: Math.PI / 8
      }
    },
    {
      time: 1.2,
      params: {
        y: 350,
        torsoAngle: Math.PI / 2.5,
        headTilt: -Math.PI / 6,
        leftShoulderAngle: Math.PI / 1.5,
        leftElbowAngle: Math.PI / 6,
        rightShoulderAngle: Math.PI / 2,
        rightElbowAngle: -Math.PI / 8,
        leftHipAngle: Math.PI / 3,
        leftKneeAngle: -Math.PI / 6,
        rightHipAngle: Math.PI / 2.5,
        rightKneeAngle: -Math.PI / 8
      }
    },
    {
      time: 1.8,
      params: {
        y: 370,
        torsoAngle: Math.PI / 2,
        headTilt: -Math.PI / 12,
        leftShoulderAngle: Math.PI / 1.2,
        leftElbowAngle: 0,
        rightShoulderAngle: Math.PI / 1.5,
        rightElbowAngle: 0,
        leftHipAngle: Math.PI / 2.2,
        leftKneeAngle: -Math.PI / 12,
        rightHipAngle: Math.PI / 2,
        rightKneeAngle: 0
      }
    },
    {
      time: 2.5,
      params: {
        y: 380,
        torsoAngle: Math.PI / 2,
        headTilt: 0,
        leftShoulderAngle: Math.PI / 1.2,
        leftElbowAngle: 0,
        rightShoulderAngle: Math.PI / 1.5,
        rightElbowAngle: 0,
        leftHipAngle: Math.PI / 2.2,
        leftKneeAngle: 0,
        rightHipAngle: Math.PI / 2,
        rightKneeAngle: 0
      }
    }
  ]
};

export const ANIMATIONS = [PUNCH_ANIMATION, GET_HIT_ANIMATION, DIE_ANIMATION];

export function getAnimationByName(name: string): Animation | undefined {
  return ANIMATIONS.find((anim) => anim.name === name);
}
