import Toast from "react-native-toast-message";

export const showToast = (text1, text2, type) => {
    Toast.show({
      text1: text1,
      type: type,
      text2: text2,
      autoHide: true,
      visibilityTime: 4000,
      topOffset: 50,
      
    })
  }