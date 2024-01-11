import React, { useState,useEffect,useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Header from "../../components/Header";
import { COLORS, height, width } from "../../components/Colors";
import Button from "../../components/Button";
import { FlatList } from "react-native-gesture-handler";
import DateTime from "../../components/DateTimePicker";
import DatePicker from "../../components/DatePicker";
import Entypo from "react-native-vector-icons/Entypo"
import { Calendar, LocaleConfig,CalendarList } from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment'
import Url from "../../Url";
const Mycalendar = ({ navigation }) => {
  const [selected, setSelected] = useState([]);
  const days = ["Mo", "Tu", "We", "Th", "fr", "Sa", "Su"];
  const [showModal, setShowModal] = useState(true);
  const [loading, isLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date())   
  const [showTimerange,setShowTimeRange]=useState(false)
  const [availability,setAvailability]=useState([])
  const [starting,setStarting] = useState()
  const [ending, setEnding] = useState()
  const [selectedDate, setSelectedDate] = useState()
  const [showTime,setShowTime]=useState(false)
  const [weekDates, setWeekDates] = useState([]);
  const [availableTime, setAvailabTime] = useState([])
  const [loadingTime,setLoadingTime]=useState(false)
const eventRef=useRef()
  
  LocaleConfig.locales['en'] = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
  };

  LocaleConfig.defaultLocale = 'en';
  useEffect(() => {
    const getWeekDates = () => {
      const startDate = moment(); // Today's date
      const weekDatesArray = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = startDate.clone().add(i, 'days');
        const date = currentDate.format('YYYY-MM-DD');
        const day = currentDate.format('ddd');

        weekDatesArray.push({ date, day });
      }

      setWeekDates(weekDatesArray);
    };
    
    getWeekDates();
  }, []);
  const handleTimeChange = (time) => {
    setStarting(time)
  }
  const handleTime = (time) => {
    setEnding(time)
  }
  const onDayPressed = async (day) => {
    setSelectedDate(day.dateString);
    
  const yOffset = 300;

  if (eventRef.current) {
    eventRef.current.scrollTo({ y: yOffset, animated: true });
  }

  setShowTimeRange(true);

  try {
    const token = await AsyncStorage.getItem('token');
    const date = day.dateString;

    if (!token) {
      return;
    }

    setLoadingTime(true);
    setAvailabTime([])
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `JWT ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const response = await fetch(`${Url}/doctor/availabilities-by-date/?date=${date}`, requestOptions);

    if (!response.ok) {
      throw new Error('Failed to fetch availabilities');
    }

    const result = await response.json();
    
    setAvailabTime(result)


    setLoadingTime(false);
  } catch (error) {
    console.log('Error:', error);
    setLoadingTime(false);
  }
};

  const addToAvailability = async() => {
    // console.log(to)
    // console.log(from)
    // console.log(selectedDate)
    // console.log(day.dateString)
    isLoading(true)
    const token = await AsyncStorage.getItem('token')
    if (!token) {
      return;
    }
//console.log(token) 
var myHeaders = new Headers();
myHeaders.append("Authorization", `JWT ${token}`);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "starting_date": `${selectedDate}T${starting}Z`,
  "ending_date": `${selectedDate}T${ending}Z`
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
//console.log(raw)
    fetch(`${Url}/doctor/availabilities/`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setStarting()
        setEnding()
        //setShowTimeRange(!showTimerange)
        isLoading(false)
        const time = {
          'start_time': `${result.start_time}`,
          'end_time':`${result.end_time}`
      }
    setAvailabTime([...availableTime,time])
  })
  .catch(error => console.log('error', error));



    const date = { "sarting_date": `${selectedDate}T${starting}Z`, "ending_date": `${selectedDate}T${ending}Z` }
  //  console.log(date) 
    setAvailability([...availability, date])
    //setShowTimeRange(!showTimerange)
    
  }
  const confirmAvailability = () => {
    availability.map((available) => {
      console.log(available)
    })
  }
  return (
    <ScrollView style={{ flex: 1 }} ref={eventRef}>
      <Header
        style={{
          backgroundColor: COLORS.doctor,
          paddingHorizontal: width / 20,
        }}
      />
      
      {showModal && (
        <View style={styles.modal}>
          <View style={styles.modalheader}>
            <Text
              style={{
                color: "#809502",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              My Calendar
            </Text>
            <TouchableOpacity onPress={() => setShowModal(!showModal)}>
              <Entypo
                name="circle-with-cross"
                color={COLORS.primary}
                size={24}
              />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 14, color: "#809502", marginHorizontal: 4 }}>
            Schedule and Make Public your daily availability
          </Text>
        </View>
      )}
      <View
        style={{
          marginTop: height / 40,
          paddingHorizontal: 16,
          backgroundColor: '#034b59',
          flex: 2,
          height: "100%",
          paddingVertical: height / 30,
          borderRadius: width / 10,
          marginHorizontal: width / 30,
          width:'100%',
          alignSelf: "center",
        }}
      >
        <Text className="text-white font-bold text-lg">My Availability</Text>
       
        <Calendar
          className="w-full rounded-lg "
          minDate={new Date().toISOString().split('T')[0]}
          onDayPress={onDayPressed}
          theme={{
            backgroundColor: '#034b59',
            calendarBackground: '#034b59',
            textSectionTitleColor: '#fff',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#ffffff',
            textDisabledColor: 'gray',
          }}
          selected={selectedDate}
          
        />
        {showTimerange && <View style={{ marginTop: height / 40 }}>
          <View className="flex flex-row justify-between">
            <Text className="font-bold text-white  ">Available Time</Text>
            <TouchableOpacity onPress={()=>setShowTime(!showTime)}>
              <AntDesign name="pluscircle" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          {loadingTime?<ActivityIndicator size="small" color='#034b59' />:<View>
            {availableTime.length ==0?<Text className="text-xs font-bold text-white">no available time for this day added</Text>:availableTime.map((item, index) => {
              return (
                <Text key={index} className="font-semibold text-grey text-xs">
                {item.start_time} - {item.end_time}
              </Text>
              )
            })}
          </View>}
          {showTime && <><View
            style={{
              
            }}
            className=" flex flex-row self-start gap-3"
          >
            <View>
              <Text style={{ fontWeight: "700", color:'white' }}>From</Text>
              <DateTime mode="time"
                date={date}
                onTimeChange={handleTimeChange} />
            </View>
            <View>
              <Text style={{ fontWeight: "700",color:'white' }} className="">To</Text>
              <DateTime
                mode="time"
                style1={{ backgroundColor: COLORS.doctor }}
                date={date}
                onTimeChange={handleTime}
              />
            </View>
            <View>
              <Text />
              <TouchableOpacity onPress={addToAvailability}
              className="self-center  px-4 py-1 mx-6 rounded-md bg-blue-400 ">
              
              <Text className="font-bold text-white">Ok</Text>
            </TouchableOpacity>
            </View>
          </View>
          {loading && <ActivityIndicator size="large" color='#034b59'/>}
          
          </> }

        </View>}
        
      </View>
     
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  headers: {
    fontWeight: "bold",
    fontSize: 19,
  },
  paragraph: {
    fontWeight: "400",
  },
  availability: {
    height: height / 13,
    width: width / 10,
    // backgroundColor: COLORS.backgrounds,
    marginHorizontal: 10,
    borderRadius: width / 7,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    marginHorizontal: width / 30,
    paddingVertical: height / 50,
    paddingHorizontal: width / 40,
    backgroundColor: "#FFF6C5",
    borderRadius: width / 30,
    marginTop: height / 50,
  },
  modalheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 4,
    alignItems: "center",
  },
});

export default Mycalendar;
