import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Button,
  Platform,
  FlatList,
  ActivityIndicator,
  TextInput
} from "react-native";
import { COLORS, height, width } from "../../components/Colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Url from "../../Url";
import Spinner from "react-native-loading-spinner-overlay";
import createPayment from "../../components/createPayment";
import Toast from "react-native-toast-message";
import { showToast } from "../../components/Toast";
const DoctorDetails = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const { doctorDetail } = route.params;
  console.log(doctorDetail)
  const available=doctorDetail?.availabilities || []
  const description = route.params.description;
  const name=route?.params?.name || 'name'
  const [rating, setRating] = useState(4);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker1, setShowPicker1] = useState(false);
  const [availableHours, setAvailableHours] = useState([]);
  const [choosenIndex, setChoosen] = useState();
  const [selectedHour, setSelecetedHour] = useState();
  const [availability_id, setAvailabilityId] = useState('')
  const [timeLoading, setDateLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phone, setPhoneNumber] = useState()
  const [choosenDate, setChoosenDate] = useState('')
  const [choosenTime,setChoosenTime]=useState('')
  const [confirmAppoint,setConfirmAppoint]=useState(false)
  const currentDate = new Date();
  const options = { weekday: "short" };
  //custom availability not well handled because of NO idea
//   useEffect(() => {
//     const updateState = () => {
//     setAvailable(doctorDetail?.personal_information?.avaibilities || [])
//     }
//     updateState()
  // },[])
  const uniqueCombinations = {};
  const uniqueItemsArray = available.filter((item) => {
  const key = `${item?.starting_date?.split('T')[0]}`;
 
  // If the key is not already in the object, add the key and return true (include the item)
  if (!uniqueCombinations[key]) {
    uniqueCombinations[key] = true;
    return true;
  }

  // If the key is already in the object, return false (exclude the item)
  return false;
  });
  
  //end Custom Availability
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
  };
  const handleTimeChange = (selectedtime) => {
    const currentTime = selectedtime || time;

    setShowPicker1(Platform.OS === "ios");
    setTime(currentTime);
  };
  const togglePicker = () => {
    setShowPicker(!showPicker);
  };
  const togglePickerTime = () => {
    setShowPicker1(!showPicker1);
  };
  const ChooseAvailability = (availability_id,index,start_time,end_time) => {
    setSelecetedHour(index)
    setAvailabilityId(availability_id)
    setChoosenTime(`${start_time}-${end_time}`)
    //rconsole.log(availability_id)
  }
  const chooseDate = async(date, index) => {
    setChoosen(index);
    setChoosenDate(date)
    setDateLoading(true)
    const token = await AsyncStorage.getItem('token')
    if (!token) {
      return 
    }
    const doctor_id=doctorDetail.id
    try {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `JWT ${token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`${Url}/doctor/availabilities-by-date/?date=${date}&doctor_id=${doctor_id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          setAvailableHours(result)
          setDateLoading(false)
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.log(error)
    }
    // setAvailableHours(date);
  };
  const BookAppointment = async () => {
    // navigation.navigate("consultation", {
    //         screen: "payment",
    //         params: {
    //           next: "success",
    //         },
    //       })
    const token = await AsyncStorage.getItem('token')
    
    if (!token) {
      return
    }
    setLoading(true)
    const paymentStatus = await createPayment(phone, 4000)
    if (!paymentStatus.success) {
      return alert('unable to confirm payment please try again later')
    }
    try {
      console.log(doctorDetail.id,availability_id)

      var myHeaders = new Headers()
      myHeaders.append('Authorization', `JWT ${token}`)
      myHeaders.append("Content-Type", "application/json");
    var raw=JSON.stringify({
    "doctor": doctorDetail.id,
    "service": "General Health",
    "doctor_availability": availability_id,
    "consultation_type": "online",
    "consultation_note": ""
    })
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect:'follow'
      }
      const response=await fetch(`${Url}/patients/appointment/`, requestOptions)
      const result=await response.json()
      if (!response.ok) {
        setLoading(false)
        Toast.show({
          type: 'error',
          text1: 'Appointment not Confirmed',
          text2: `${result[0]}`,
          visibilityTime: 5000, // 5 seconds
          position: 'top',
          autoHide: true,
          bottomOffset: 40,
          swipeable:true
        });
      }
        setLoading(false)
        Toast.show({
          type: 'success',
          text1: 'Appointment Confirmed',
          text2: `Appointment with ${doctorDetail?.personal_information?.full_name} on ${choosenDate} at ${choosenTime}`,
          visibilityTime: 5000, // 5 seconds
          position: 'top',
          autoHide: true,
          bottomOffset: 40,
          swipeable: true,
          topOffset: 40,
          
        });
      
      navigation.navigate("consultation", {
            screen: "payment",
            params: {
              next: "success",
            },
          })
    } catch (error) {
      console.log(error)
    }
  }
  const ratingStars = [1, 2, 3, 4, 5];
  const doctor = {
    image: require("../../assets/profile.jpeg"),
    patients: "2000+",
    experience: "5Years",
    awards: "10+",
    specialization: [
      "Dermatologist",
      "Ureology",
      "General",
      "Dental",
      "Genocologist",
    ],
    current: "Dermatologist",
    rating: rating,
  };
  const Reusablecircle = ({ name, name1, name2 }) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: width / 10,
            height: width / 10,
            borderRadius: width / 10,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome5Icon name={name} size={25} color={COLORS.black} />
        </View>
        <View style={{ marginHorizontal: width / 40 }}>
          <Text
            style={{ color: COLORS.white, fontWeight: "700", fontSize: 18 }}
          >
            {name1}
          </Text>
          <Text style={{ color: COLORS.white, fontWeight: "400" }}>
            {name2}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <View style={{ flex: 1 }}>
      
      
      <Spinner visible={loading} color={COLORS.Issacolor} />
      <View
        style={{
          backgroundColor: COLORS.primary,
          height: height / 3,
          borderBottomEndRadius: width / 25,
          borderBottomLeftRadius: width / 25,
          paddingHorizontal: width / 16,
        }}
      >
        <Toast />
        <TouchableOpacity style={{ marginTop: height / 30 }}>
          <AntDesign name="arrowleft" color={COLORS.white} size={30} />
        </TouchableOpacity>
        
        <View
          style={{
            marginTop: height / 40,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{uri:doctorDetail?.personal_information?.profile_image}}
            style={{
              width: width / 4,
              height: width / 4,
              borderRadius: width / 18,
              borderColor: COLORS.white,
              borderWidth: 1,
            }}
            resizeMode="cover"
          />
          <View style={{ marginLeft: width / 20 }}>
            <Text
              style={{ color: COLORS.white, fontWeight: "bold", fontSize: 18 }}
            >
              {doctorDetail?.personal_information?.full_name}
            </Text>
            <Text style={{ color: COLORS.warning }}>{doctorDetail?.personal_information?.specialities||doctor.current}</Text>
            <View style={{ flexDirection: "row" }}>
              {ratingStars.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setRating(index + 1)}
                  >
                    <Entypo
                      name="star"
                      size={25}
                      color={
                        rating >= index + 1 ? "yellow" : COLORS.backgrounds
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: height / 16 }}>
          <Reusablecircle
            name="user-plus"
            name1={doctor.patients}
            name2="Patients"
          />
          <Reusablecircle
            name="star-of-david"
            name1={doctor.experience}
            name2="Experiences"
          />
          <Reusablecircle name="award" name1={doctor.awards} name2="awards" />
        </View>
      </View>
      <View style={{ paddingHorizontal: width / 20, marginTop: 10 }}>
        <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: "bold" }}>
          Biography
        </Text>
        <Text style={{ maxWidth: "100%", maxHeight: height / 10 }}>
          {doctorDetail?.personal_information?.description||`${doctorDetail?.personal_information?.full_name} has not yet added Biography`}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 10,
            marginTop: 10,
            fontWeight: "bold",
          }}
        >
          Specializations
        </Text>
        <View>
          <ScrollView
            contentContainerStyle={{ flexDirection: "row" }}
            style={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator
          >
            {doctor.specialization.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: width / 3.8,
                    height: width / 10,
                    borderRadius: width / 30,
                    backgroundColor: COLORS.doctor,
                    marginHorizontal: width / 60,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: COLORS.white, fontWeight: "500" }}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 10,
            marginTop: 10,
            fontWeight: "bold",
          }}
        >
          Schedule
        </Text>
      </View>
      {available.length != 0 ? <>
      <View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {uniqueItemsArray?.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => chooseDate(item?.starting_date?.split("T")[0].split("/")[0], index)}
                key={index}
                style={{
                  paddingHorizontal: width / 30,
                  borderWidth: 1,
                  borderRadius: width / 50,

                  marginHorizontal: width / 40,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    choosenIndex === index ? COLORS.primary : null,
                }}
              >
                <Text>{item?.start_day} </Text>
                <Text>{item?.starting_date?.split("T")[0].split("/")[0]}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <Text
        style={{
          fontSize: 18,
          marginBottom: 10,
          marginTop: 10,
          fontWeight: "bold",
          marginLeft: width / 25,
        }}
      >
        Select Time
      </Text>
      {timeLoading && <ActivityIndicator color={COLORS.Issacolor} size="large" />}
      <FlatList
        className="px-1"
        numColumns={2}
        data={availableHours}
        keyExtractor={(item, index) => index.toString()} 
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => ChooseAvailability(item.id,index,item?.start_time,item?.end_time)}
              style={{
                
                backgroundColor: selectedHour === index ? COLORS.primary : null,
              }}
              className="border rounded-md px-1 py-1 mx-1 "
            >
              <Text className="text-sm font-bold">{item?.start_time} - {item?.end_time}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity onPress={()=>showToast()}>
        <Text>Show Toast</Text>
      </TouchableOpacity>
      {confirmAppoint && <>
        <View style={{ backgroundColor: COLORS.Issacolor, bottom: 0, position: 'absolute', width: '100%' }} className="flex-1  bottom-10 z-20 rounded-t-3xl  px-8 py-3 ">
          <Text className="text-orange-500 font-bold">Are you sure you want to confirm this Appointment on {choosenDate} at {choosenTime} with { doctorDetail?.personal_information?.full_name}?</Text>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-white font-bold text-lg py-3">Confirm Appointment</Text>
          <TouchableOpacity onPress={()=>setConfirmAppoint(false)}>
            <Entypo name="circle-with-cross" color='orange' size={30} />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Enter phone number"
          keyboardType="numeric"
          className="border border-white py-2 rounded-md px-3 text-white"
          placeholderTextColor={COLORS.white}
          value={phone}
          onChangeText={(text)=>setPhoneNumber(text)}
        />
        <TouchableOpacity className="rounded-lg bg-white py-2 items-center my-2" onPress={()=>BookAppointment()}>
          <Text className="text-gray font-bold">Pay for Appointment</Text>
        </TouchableOpacity>
      </View>
      </>}
      {/* <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: width / 10,
          }}
        >
          <View>
            <Text>{date && date.toDateString()}</Text>
          </View>
          <View>
            <Text>{time && moment(time).format("LT")}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: width / 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
              height: height / 20,
              borderRadius: width / 30,

              width: "48%",
              marginTop: height / 70,
            }}
            onPress={() => togglePicker()}
          >
            <Text style={{ fontWeight: "bold", color: COLORS.white }}>
              Choose Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
              height: height / 20,
              borderRadius: width / 30,
              width: "48%",
              marginTop: height / 70,
            }}
            onPress={() => togglePickerTime()}
          >
            <Text style={{ fontWeight: "bold", color: COLORS.white }}>
              Choose Time
            </Text>
          </TouchableOpacity>
        </View>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {showPicker1 && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View> */}
      <TouchableOpacity
        onPress={() =>setConfirmAppoint(true)}
        style={{
          height: height / 20,
          width: "95%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.primary,
          alignSelf: "center",
          marginTop: height / 30,
          borderRadius: width / 40,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 17, color: COLORS.white }}>
          Book Appointment
        </Text>
      </TouchableOpacity>
      </> : <Text className="mx-4 font-bold text-lg">No Avaible Time for {doctorDetail?.personal_information?.full_name},check for other Beokay Doctors</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  datePicker: {
    width: 200,
  },
});

export default DoctorDetails;
