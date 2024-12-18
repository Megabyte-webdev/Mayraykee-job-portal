import { registration_steps_keys } from "../utils/constants";

export function registrationType(type){
  console.log(type)
  if(type){ 
    return registration_steps_keys[type]
  }else{return registration_steps_keys["candidate"]}
}

export const intialProfileState = registration_steps_keys.create_account

export function RegistrationReducer(state, action) {
    switch (action.type) {
      case registration_steps_keys.create_account.title:
        return { ...action.payload };
      case registration_steps_keys.email_verification.title:
        return { ...action.payload };
      case registration_steps_keys.person_details.title:
        return { ...action.payload };
      case registration_steps_keys.course_details.title:
        return { ...action.payload };
      case registration_steps_keys.welcome_video.title:
        return { ...action.payload };
      default:
        return state;
    }
  }