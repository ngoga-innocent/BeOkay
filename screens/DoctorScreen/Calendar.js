import React from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarScreen =({markedDates,selected})=>{
  //console.log(markedDates)
  const customDay = (date) => {
    const day = markedDates;

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center', color: day ? 'green' : 'red' }}>
          {date.day}
        </Text>
        {day && (
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: 'red',
              position: 'absolute',
              bottom: 0,
              alignSelf: 'center',
            }}
          />
        )}
      </View>
    );
  };
    return (
      <View style={{ flex: 1 }}>
        <Calendar
          // Initial selected dates
          selected={selected || [new Date().toISOString().split("T")[0]]}
          // Disable specific dates
          // disabledDates={["2023-06-01", "2023-06-02"]}
          aria-selected={true}
          // Customize the header
          renderHeader={(date) => {
            /* Your custom header component */
            return <Text>{date.toString()}</Text>;
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150'
          }}
          // Define event dates
          // markedDates={{
          //   "2024-01-17": { marked: true },
          //   "2023-06-10": { marked: true, dotColor: "red" },
          //   "2024-01-18": { marked: true, dotColor: "blue", activeOpacity: 0 },
          // }}
          markedDates={markedDates}
          renderDay={(date) => customDay(date)}
         
        />
      </View>
    );
  }


export default CalendarScreen;
