import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { React, useState,useEffect } from "react";
import Header from "../../components/Header";
import Entypo from "react-native-vector-icons/Entypo";
import { COLORS, width, height } from "../../components/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import Button from "../../components/Button";
import Input from "../../components/Input";
import CalendarScreen from "./Calendar";
import AntiDesign from "react-native-vector-icons/AntDesign";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { Avatar } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TabView, TabBar } from "react-native-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Url from "../../Url";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
//import { getDocProfile } from "../../components/getDoctorProfile";
const ScheduleAppointment = ({ navigation }) => {
  const date = new Date().getDate();
  const hour = new Date().getHours();
  const time = new Date().getMonth();
  const [showModal, setShowModal] = useState(true);
  const [name, setName] = useState("Jessica");
  const [joinCall, setJoin] = useState(false);
  const [visibleDesc, setDescription] = useState();
  const [cancelappoint, setCanceled] = useState(false);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const [Appointments, setAppointments] = useState([])
  const [AppointmentsLoading, setAppointmentLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [consultations, setConsultations] = useState([])
  const [markedDates,setMarkedDates]=useState({})
  const [routes] = useState([
    { key: "first", title: "Appointments & Schedule" },
    { key: "second", title: "My Calendar" },
  ]);
  const [Profile,setProfile]=useState({})
  
  // const consultations = [
  //   {
  //     Image: require("../../assets/cuate.png"),
  //     fname: "Michael",
  //     sname: "Simpson",
  //     time: "4:4pm",
  //     date: "dEC 7",
  //   },
  //   {
  //     Image: require("../../assets/amico.png"),
  //     fname: "Michael",
  //     sname: "Simpson",
  //     time: "4:4pm",
  //     date: "dEC 7",
  //   },
  //   {
  //     Image: require("../../assets/amico.png"),
  //     fname: "Michael",
  //     sname: "Simpson",
  //     time: "4:4pm",
  //     date: "dEC 7",
  //   },
  //   {
  //     Image: require("../../assets/amico.png"),
  //     fname: "Michael",
  //     sname: "Simpson",
  //     time: "4:4pm",
  //     date: "dEC 7",
  //   },
  // ];
  const ConfirmAppointment = async (id) => {
    setConfirmLoading(true)
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return Toast.show({
        text1: 'Login Details',
        text2: 'please Login to Confirm Appointment',
        type: 'error',
        
      })
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `JWT ${token}`);
  
var raw = "";

var requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`${Url}/doctor/appointments/?id=${id}`, requestOptions)
  .then(response => response.json())
  .then(result => {
    if (result.is_confirmed) {
      setAppointments(Appointments.filter((appointments)=>appointments.id !=id))
      setConfirmLoading(false)
      Toast.show({
        autoHide:true,
        text1: 'Confirmation',
        text2: 'Appointment has been successfully confirmed',
        type: 'success',
        visibilityTime:5000,
        
      })
    }
    setConfirmLoading(false)
  
  })
  .catch(error => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
      visibilityTime:5000
    })
  });
  }
  // const Profile = {
  //   Image: require("../../assets/cuate.png"),
  //   name: "Dr .Kanimba",
  //   specialite: "Physiology",
  //   rating: 4.4,
  //   bio: "Attended Doctorates in Francais for specialization in Physiology",
  // };
  useEffect(() => {
  const fetchDoctorData = async () => {
    setIsLoading(true);
    try {
      await getDoctor();
      await GetAppointments();
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchDoctorData();
}, []);
  const getDoctor = async () => {
    setIsLoading(true)
    const token = await AsyncStorage.getItem('token')
    const id = await AsyncStorage.getItem('DocId')
    if (!token) {
      setIsLoading(false)
      return alert('please first Login')
    }
    try {
    const myHeaders = new Headers()
    myHeaders.append('Authorization',`JWT ${token}`)
    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
      fetch(`${Url}/doctor/profile`, requestOptions)
        .then(response => response.json())
        .then(result => {
        setProfile(result)
        setIsLoading(false)
       }).catch(error=>console.log(error))
      // const result = await response.json()
      // if (!response.ok) {
      //   setIsLoading(false)
      //   return alert('failed to fetch your profile Data')
      // }
      // console.log(result.personal_information.profile_image)
      // setProfile(result)
      // setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  const GetAppointments = async () => {
    setAppointmentLoading(true)
    const token = await AsyncStorage.getItem('token')
    if (!token) {
      return
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `JWT ${token} `);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

await fetch(`${Url}/doctor/appointments`, requestOptions)
  .then(response => response.json())
  .then(result => {
    setAppointments(result.filter((appointment)=>!appointment.is_confirmed ))
    //console.log(result)
    const confirmedAppointments =  result.filter((consultation) => consultation.is_confirmed)
    setConsultations(confirmedAppointments)
    const newMarkedDates = {}
    confirmedAppointments.length !== 0 && (
      confirmedAppointments.forEach(appoint => {
        const date = appoint?.doctor_availability?.starting_date?.split('T')[0];
        newMarkedDates[date]={ marked: true, dotColor: 'green',selected:true,selectedColor:COLORS.Issacolor};
    })
    )
    setMarkedDates(newMarkedDates)
    
    setAppointmentLoading(false)
  })
  .catch(error => console.log('error', error));
  }
  const CancelAppointment = () => {
    setCanceled(true);
  };
  const CancelPrompt = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: height / 2.6,
          backgroundColor: COLORS.white,
          width: width,
          borderTopEndRadius: width / 17,
          borderTopStartRadius: width / 17,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        <Text
          style={{
            marginBottom: height / 50,
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          Reason for Cancellation
        </Text>
        <TextInput
          placeholder="Why did you cancel appointment?"
          multiline
          numberOfLines={5}
          style={{
            height: height / 8,
            maxHeight: height / 10,
            borderColor: COLORS.black,
            borderWidth: 1,
            padding: 5,
            borderRadius: width / 25,
            marginBottom: 10,
            width: "95%",
          }}
        />
        <TouchableOpacity
          onPress={() => setCanceled(false)}
          style={{
            backgroundColor: COLORS.doctor,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            height: height / 18,
            width: "95%",
            borderRadius: width / 30,
          }}
        >
          <Text
            style={{ fontWeight: "bold", color: COLORS.text, fontSize: 19 }}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  // const CancelPrompt = () => {
  //   return (
  //     <Modal
  //       visible={cancelappoint}
  //       animationType="fade"
  //       style={{
  //         // alignSelf: "center",

  //         marginTop: height / 2.4,
  //       }}
  //       collapsable={true}
  //     >
  //       <View
  //         style={{
  //           // flex: 1,
  //           marginTop: height / 2.4,
  //           zIndex: 3,
  //           justifyContent: "center",
  //           alignItems: "center",
  //           // backgroundColor: COLORS.green,
  //         }}
  //       >
  //         <TextInput
  //           placeholder="Why did you cancel appointment?"
  //           multiline
  //           numberOfLines={5}
  //           style={{
  //             height: height / 14,
  //             maxHeight: height / 10,
  //             borderColor: COLORS.black,
  //             borderWidth: 1,
  //             padding: 5,
  //             borderRadius: width / 25,
  //             marginBottom: 10,
  //             width: "95%",
  //           }}
  //         />
  //         <TouchableOpacity
  //           onPress={() => setCanceled(false)}
  //           style={{
  //             backgroundColor: COLORS.doctor,
  //             alignItems: "center",
  //             justifyContent: "center",
  //             alignSelf: "center",
  //             height: height / 23,
  //             width: "95%",
  //             borderRadius: width / 30,
  //           }}
  //         >
  //           <Text style={{ fontWeight: "bold" }}>Submit</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </Modal>
  //   );
  // };
  const AppointmentView = () => (
    <View style={{}}>
      {AppointmentsLoading ? <ActivityIndicator size='large' color={COLORS.Issacolor} /> : <>
        {Appointments.length == 0 ? <Text>You have no unconfirmed Appointment</Text> : <>
        <AppointmentList appointments={Appointments} />
        </>}
      </>}

      
      {/* <CalendarScreen /> */}
      {/* <Button
            onPress={() => navigation.navigate("history")}
            text="Schedule an appoint"
            style={{
              height: height / 17,
              backgroundColor: COLORS.doctor,
              width: width - 30,
              // marginTop: height / 14,
            }}
          /> */}
    </View>
  );
  const AppointmentList = ({ appointments }) => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        // style={{ height: height / 4 }}
        data={appointments}
        renderItem={({ item, index }) => (
          visibleDesc == index && confirmLoading ? <ActivityIndicator color={COLORS.Issacolor} size='large' /> : <>
          <TouchableOpacity
            onPress={() =>
              visibleDesc 
                ? setDescription(null)
                : setDescription(index)
            }
            style={{
              // marginBottom: 5,
              shadowColor: COLORS.white,
              shadowOpacity: 1,
              shadowRadius: 4,
              zIndex: 7,

              // alignItems: "center",
              backgroundColor: COLORS.backgrounds,
              marginVertical: height / 90,
              borderRadius: width / 20,
              padding: width / 60,
              justifyContent: 'center',
            }}
          >
            
            <View className="flex flex-row justify-between px-1 items-center mb-2">
              <View className="flex flex-row items-center">
                <Avatar source={{ uri: item?.patient?.personal_information?.profile_image }} rounded size='medium' />
                <View className="ml-2">
                  <Text className="font-bold ">
                    {item?.patient?.personal_information?.full_name}
                  </Text>
                  <View className="flex flex-row items-center">
                    <EvilIcons name="calendar" size={24} />
                    <Text>{item?.doctor_availability?.starting_date?.split('T')[0]}</Text>
                    
                  </View>
                  
                  {/* name,calendaicon and start date */}
                </View>
              </View>
              <View>
                <View className="flex flex-row items-center">
                  <Ionicons name="time-sharp" size={25} />
                  <Text>{item?.doctor_availability?.start_time }</Text>
                </View>
                {/* watch icon and start time */}
              </View>
              {/* ICON */}
              {visibleDesc ==index ? <Entypo name="chevron-up" size={30} /> : <Entypo name="chevron-down" size={30 } />}
            </View>
            {visibleDesc==index && <View className="flex flex-row items-center mt-5 gap-3">
              <TouchableOpacity className={`rounded-lg px-2 py-3 bg-[#034b59]`}>
                <Text className="text-white font-bold">View Appointment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-lg px-6 py-3 bg-green-600`}
              onPress={()=>ConfirmAppointment(item.id)}
              >
                <Text className="text-white font-bold">Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`rounded-lg px-6 py-3 bg-red-700`}>
                <Text className="text-white font-bold">Reject</Text>
              </TouchableOpacity>
            </View>}
          </TouchableOpacity></>
        )}
        />
  )
}
  const CalendarView = () => (
    <ScrollView>
      <CalendarScreen markedDates={markedDates} />
    </ScrollView>
  );
  const renderScene = ({ route }) => {
    switch (route?.key) {
      case "first":
        return AppointmentView();
      case "second":
        return CalendarView();

      default:
        return null;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
       <Spinner visible={isLoading} color={COLORS.Issacolor} />
      <View style={{ paddingHorizontal: width / 30 }}>
        <View
          style={{
            marginTop: height / 70,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Docprofile")}>
              <Avatar
                //source={Profile.image}
                source={{uri: Profile?.personal_information?.profile_image || null}}
                size="large"
                rounded
                containerStyle={{ borderWidth: 1 }}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: width / 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {Profile?.personal_information?.username || 'loading..'}
              </Text>
              <Text style={{ fontWeight: "700" }}>{Profile?.specialties || 'Not specified'}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="star" color="orange" size={20} />
                <Text style={{ fontSize: 17, marginLeft: width / 25 }}>
                  {Profile?.rating || '3.5'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* <View
        style={{
          position: "absolute",
          bottom: 0,
          height: height / 2.6,
          backgroundColor: COLORS.green,
          width: width,
          borderRadius: width / 7,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Family</Text>
      </View> */}
      {cancelappoint && <CancelPrompt />}
      <View>
        {/* <View
          style={{
            marginTop: height / 70,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: width / 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar size="large" source={user.profile} rounded />
            <View style={{ marginLeft: width / 10 }}>
              <Text style={{ color: COLORS.backgrounds, fontSize: 15 }}>
                Welcome Back
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 23 }}>
                {user.name}
              </Text>
            </View>
          </View>
        </View> */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: height / 20,
            paddingHorizontal: width / 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            Upcoming Consultations
          </Text>
          <AntiDesign name="arrowright" size={30} />
        </View>
        <FlatList
          style={{ marginTop: height / 40, paddingHorizontal: width / 20 }}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={consultations}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  // alignItems: "center",
                  width: width / 2.3,
                  backgroundColor: joinCall ? COLORS.doctor : COLORS.primary,
                  marginRight: width / 20,
                  borderRadius: width / 22,
                  paddingHorizontal: "6%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",

                    width: "100%",
                    marginTop: 20,
                  }}
                >
                  <Avatar
                    source={{uri:item?.patient?.personal_information?.profile_image}}
                    rounded
                    size="medium"
                    containerStyle={{
                      borderWidth: 2,
                      borderColor: "black",
                    }}
                  />
                  <View>
                    <Text
                      style={[
                        styles.text,
                        { textTransform: "uppercase", fontSize: 16 },
                      ]}
                    >
                      {item?.doctor_availability?.start_time }
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          textTransform: "uppercase",
                          fontSize: 13,
                          textAlign: "right",
                        },
                      ]}
                    >
                      {item?.doctor_availability?.starting_date?.split('T')[0] }
                    </Text>
                  </View>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Text
                    style={[
                      styles.text,
                      { textTransform: "capitalize"},
                    ]}
                    className="text-sm"
                  >
                    {item?.patient?.personal_information?.full_name}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      { textTransform: "capitalize" },
                    ]}
                    className="text-sm"
                  >
                  {item?.patient?.personal_information?.username}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    width: "90%",
                    alignSelf: "center",
                    backgroundColor: joinCall ? COLORS.primary : COLORS.white,
                    height: height / 30,
                    borderRadius: width / 15,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 20,
                  }}
                >
                  {joinCall === true ? (
                    <Text style={{ fontWeight: "bold" }}>Join Session </Text>
                  ) : (
                    <Text style={{ fontWeight: "bold" }}>Begin Session</Text>
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      

      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          // marginHorizontal: 8,
          borderRadius: 7,
          marginTop: height / 70,
          height: "100%",
          padding: width / 40,
          borderTopLeftRadius: width / 20,
          borderTopRightRadius: width / 20,
        }}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: COLORS.doctor }}
              indicatorContainerStyle={{ height: 4 }}
              style={{
                backgroundColor: COLORS.doctor,
                borderRadius: width / 20,
              }}
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
      <Toast />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.doctor,
    // marginTop: height / 20,
  },
  modal: {
    marginHorizontal: 8,
    width: 343,
    backgroundColor: "#FFF6C5",
    borderRadius: 15,
    height: 98,
    marginTop: 13,

    padding: 5,
  },
  modalheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 4,
    alignItems: "center",
  },
  button: {
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    width: "45%",

    padding: height / 60,
  },
});

export default ScheduleAppointment;
