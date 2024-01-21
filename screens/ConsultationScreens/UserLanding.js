import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import { React, useState, useLayoutEffect,useEffect } from "react";
import Header from "../../components/Header";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from "react-native-vector-icons/Entypo";
import { COLORS, height, width } from "../../components/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Url from "../../Url";
import HeaderTab from "../../components/HeaderTab";
import Button from "../../components/Button";
import { TabBar, TabView } from "react-native-tab-view";
import CalendarScreen from "../DoctorScreen/Calendar";
import Toast from "react-native-toast-message";
import Spinner from "react-native-loading-spinner-overlay";

const UserLanding = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [Appointment, setAppointments] = useState([]);
  const [notification,setNotification]=useState()
  const [isLoading,setisLoading]=useState(false)
  const [routes] = useState([
    { key: "first", title: "Appointments" },
    { key: "second", title: "My Calendar" },
  ]);
  useLayoutEffect(() => {
    getProfile();
    getCurrentDateAndDay();
    GetAppointments();
  }, []);
  useEffect(() => {
     GetAppointments();
   },[]
  )
  const getCurrentDateAndDay = () => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const day = new Date().getDay();

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayOfWeek = daysOfWeek[day];

    setCurrentDate(`${date}-${month}-${year}`);
    setCurrentDay(currentDayOfWeek);
  };
  const GetAppointments = async () => {
    setisLoading(true)
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return Toast.show({
        text1: "Error",
        text2: 'Failed to get Your Appointment please check your Internet and try again',
        type: 'error',
        visibilityTime: 10,
        
      })
    }
    var myHeaders = new Headers()
    myHeaders.append('Authorization', `JWT ${token}`)
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect:'follow'
    }
    fetch(`${Url}/patients/appointment/`, requestOptions)
      .then(response => response.json())
      .then(result => {
        
        if (result.length > 0) {
          const currentDate = new Date()
          let notificationShown = false;
          result.forEach(item => {
            const startingDate = new Date(item?.doctor_availability_details?.starting_date);
            const timeDifference = startingDate - currentDate
            
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            
            if (daysDifference <= 1 && !notificationShown) {
              
              Toast.show({
                text1: 'Alert',
                type:'info',
                text2: `You have the incoming Appointment on ${item?.doctor_availability_details?.starting_date?.split('T')[0]} at 
                ${item?.doctor_availability_details?.starting_date?.split('T')[1]?.substring(0,5)}`
              })
              notificationShown=true
            }
            
             Toast.show({
               text1: 'Alert',
               type:'success',
                text2: `You have the incoming Appointment on ${item?.doctor_availability_details?.starting_date?.split('T')[0]} at 
                ${item?.doctor_availability_details?.starting_date?.split('T')[1]?.substring(0,5)}`
              })
            
          });
         
          setAppointments(result.filter((item) => {
            // Check if startingDate is a valid Date object
            const startingDate = item?.doctor_availability_details?.starting_date;
          //   if (isNaN(startingDate)) {
          //     console.log(startingDate)
          //         return false; // Skip invalid dates
          //     }
            
            // return startingDate > currentDate;
            
            return new Date(startingDate) >= currentDate
          }
          )
          )
          setisLoading(false)
      }
      Toast.show({
        text1: "Error",
        text2: 'Please Login As Patient',
        type: 'error',
        visibilityTime: 10,
        
      })
      
      

    })
  }
  const Appointments = () => (
    <ScrollView
      
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled
      className="py-1 px-2 h-full flex-1"
      style={{flex:1}}
    >
      {Appointment?.map((item, index) => {
        return (
          <TouchableOpacity key={index} style={{ flexDirection: "row"  }} className="bg-white rounded-xl border border-slate-300 z-10 py-1 mb-2 items-center justify-between ">
            <View className="flex flex-row">
            <View
              style={{
                // width: width / 6,
                // maxWidth: width / 6,
                // height: width / 6,
                // alignItems: "center",
                // justifyContent: "center",
                // borderRadius: 68,
                backgroundColor: COLORS.Issacolor,
                
              }}
              className="z-10 border-2 border-white shadow-lg shadow-black rounded-xl items-center justify-center px-1 py-5"
            >
              <Text
                style={{
                 
                  color: COLORS.white,
                  textAlign: "center",
                }}
                className="text-xs"
              >
                {item?.doctor_availability_details?.starting_date?.split('T')[0]}
              </Text>
            </View>
            <View
              style={{
                alignItems: "left",
                justifyContent: "center",
                
              }}
              className="mx-2"
            >
              <Text
                style={{
                  color: COLORS.paragraph,
                  fontSize: 14,
                  fontWeight: "400",
                  marginBottom: 4,
                }}
              >
                {item?.doctor_profile?.personal_information?.full_name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginRight: 3,
                  maxWidth: 170,
                }}
              >
                <Text>{item?.doctor_availability_details?.starting_date?.split('T')[1].substring(0, 5)}h</Text>
                <Text className="font-bold"> {item?.consultation_type}</Text>
              </View>
              
              </View>
              </View>
            <View className="items-end mx-4">
                {item?.is_confirmed?<AntDesign name="checkcircle" size={18} color={COLORS.doctor} />:<AntDesign name="exclamationcircle" color='orange' size={18} />}
                <Text>{item?.is_confirmed?`Confirmed`:`Pending` }</Text>
              </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const Mycalendar = () => (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <CalendarScreen />
    </ScrollView>
  );

  const renderScene = ({ route }) => {
    switch (route?.key) {
      case "first":
        return Appointments();
      case "second":
        return Mycalendar();

      default:
        return null;
    }
  };
  const [showModal, setShowModal] = useState(true);
  const [name, setName] = useState("");

  const getProfile = async () => {
    const token = await AsyncStorage.getItem("token");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "JWT " + `${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${Url}/users/edit-profile/`, requestOptions)
      .then((response) => {
        if (response.status == 401) {
          navigation.navigate("Auth", { screen: "Login" });
          return response.json();
        } else {
          return response.json();
        }
      })
      .then((result) => {
        AsyncStorage.setItem("name", result.username);
        setName(result.username);
      })
      .catch((error) => console.log("error", error));
  };
  const status = {
    pressue: 150,
    lastilliness: "headache",
    lastdrugs: "paracetamol",
  };
  

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Header style={{ paddingHorizontal: width / 17 }} />
      {isLoading && <Spinner visible={isLoading} color={COLORS.doctor} />}
      <Toast />
      <View style={styles.modal}>
        <View style={styles.modalheader}>
          <Text
            style={{
              color: "#809502",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            Good Day {name}
          </Text>
          <Text
            style={{
              color: "#809502",
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            {currentDay} {currentDate}
          </Text>
        </View>

        {/* <Text style={{ fontSize: 14, color: "#809502", marginHorizontal: 4 }}>
          how are you doing?if there is any help you need please let Be-Okay
          know
        </Text> */}
      </View>
      <View
        style={{
          //   backgroundColor: COLORS.white,
          marginHorizontal: 8,
          borderRadius: 7,
          marginVertical: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 13 }}>
            Health Status
          </Text>
          <Text style={{ color: COLORS.text, fontWeight: "300", fontSize: 10 }}>
            last 30 days
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("E.H.R")}
          style={{
            marginHorizontal: 10,
            flexDirection: "row",
            marginVertical: 7,
          }}
        >
          <View
            style={{
              height: width / 10,
              width: width / 10,
              backgroundColor: COLORS.primary,
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="blood-bag" size={40} color="white" />
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{
                color: COLORS.paragraph,
                fontSize: 13,
                fontWeight: "800",
              }}
            >
              Blood Pressure
            </Text>
            <Text style={{ fontWeight: "bold" }}>{status.pressue}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("E.H.R")}
          style={{
            marginHorizontal: 10,
            flexDirection: "row",
            marginVertical: 7,
          }}
        >
          <View
            style={{
              height: width / 10,
              width: width / 10,
              backgroundColor: COLORS.primary,
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Fontisto name="blood-test" size={30} color="white" />
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{
                color: COLORS.paragraph,
                fontSize: 13,
                fontWeight: "800",
              }}
            >
              Last Illiness
            </Text>
            <Text style={{ fontWeight: "bold" }}>{status.lastilliness}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("E.H.R")}
          style={{
            marginHorizontal: 10,
            flexDirection: "row",
            marginVertical: 7,
          }}
        >
          <View
            style={{
              height: width / 10,
              width: width / 10,
              backgroundColor: COLORS.primary,
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="medical-bag" size={30} color="white" />
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{
                color: COLORS.paragraph,
                fontSize: 13,
                fontWeight: "800",
              }}
            >
              Last Drugs
            </Text>
            <Text style={{ fontWeight: "bold" }}>{status.lastdrugs}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: COLORS.white,
          borderTopEndRadius: width / 10,
          borderTopLeftRadius: width / 10,
          //   backgroundColor: COLORS.white,
          //   justifyContent: "center",
          //   alignItems: "center",
          //   marginVertical: height / 78,
          //   borderRadius: width / 14,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            marginTop: width / 15,
            alignSelf: "center",
          }}
        >
          What are you Looking For?
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: width / 6,
            alignSelf: "center",
            marginVertical: height / 75,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("consultation", {
                screen: "Consultations",
                params: { name: "checkup" },
              })
            }
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/medical_checkup.png")}
              style={{
                width: width / 8,
                height: width / 8,
              }}
            />
            <Text style={{ textAlign: "center", maxWidth: "80%" }}>
              General Checkup
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("consultation", {
                screen: "Consultations",
                params: { name: "chat" },
              })
            }
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/chat_medical.png")}
              style={{ width: width / 8, height: width / 8 }}
            />
            <Text style={{ textAlign: "center", maxWidth: "80%" }}>
              Chat With Doctor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("consultation", {
                screen: "Consultations",
                params: { name: "homecare" },
              })
            }
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/homecare.png")}
              style={{ width: width / 8, height: width / 8 }}
            />
            <Text style={{ textAlign: "center", maxWidth: "80%" }}>
              Home Care
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <Text
          style={{
            fontWeight: "500",
            fontSize: 16,
            marginVertical: 5,
            marginLeft: 7,
          }}
        >
          Appointment and Schedule
        </Text> */}
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "white" }}
              indicatorContainerStyle={{ height: 4 }}
              style={{ backgroundColor: COLORS.white }}
              renderLabel={({ route, focused, color }) => (
                <View
                  style={{
                    borderRadius: focused ? width / 10 : null,
                    backgroundColor: focused ? COLORS.primary : null,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: focused ? COLORS.white : null,
                      textAlign: "center",
                      padding: 9,
                      fontWeight: "bold",
                    }}
                  >
                    {route.title}
                  </Text>
                </View>
              )}
            />
          )}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    marginHorizontal: 8,
    width: 343,

    borderRadius: 15,

    marginTop: width / 80,

    padding: 5,
  },
  modalheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 4,
    alignItems: "center",
  },
});

export default UserLanding;
