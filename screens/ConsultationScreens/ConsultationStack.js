import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserLanding from "./UserLanding";
import Consultation from "./Consultation";
import Describedisease from "./Describedisease";
import Description from "./Description";
import Method from "./Method";
import Results from "./AIScreen/Results";
import Payment from "../../components/Payment";
import ConsultationResults from "./ConsultionResults";
import Momo from "../Payments/Momo";
import Card from "../Payments/Card";
import Paypal from "../Payments/Paypal";
import { COLORS } from "../../components/Colors";
import Aiconsultation from "./AIScreen/Aiconsultation";
import Icon from "react-native-vector-icons/AntDesign";
import Profile from "../Profile/Profile";
import Patient_Profile from "../Profile/Patient_Profile";
import Mycalendar from "../DoctorScreen/Mycalendar";
import ConsultationHistory from "../DoctorScreen/ConsultationHistory";
import PatientRecord from "../DoctorScreen/patientRecord";

import ScheduleAppointment from "../DoctorScreen/ScheduleAppointment";
import Support from "../OtherScreen/Support";
import ChattingStack from "../Chatting/chattingStack";
import Viewall from "../OtherScreen/Viewall";
import HomeCare from "./HomeCare";
import DoctorDetails from "./DoctorDetails";
import SuccessApointment from "./SuccessApointment";
import Report from "./Report";
import Notification from "../OtherScreen/Notification";
const ConsultationStack = ({ navigation }) => {
  const stack = createStackNavigator();
  return (
    <stack.Navigator initialRouteName="Consultations">
      <stack.Screen
        name="Consultations"
        component={Consultation}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="viewall"
        component={Viewall}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="success"
        component={SuccessApointment}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="doctorDetails"
        component={DoctorDetails}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="homeCare"
        component={HomeCare}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="Describe"
        component={Describedisease}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="Description"
        component={Description}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="Method"
        component={Method}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="report"
        component={Report}
        options={{ headerShown: false }}
      />

      <stack.Screen
        name="Aiconsultation"
        component={Aiconsultation}
        options={{
          headerTitle: "Consultation",
          headerLeft: () => (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate("Method")}>
                <Icon name="arrowleft" size={30} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            height: 120,
            backgroundColor: COLORS.primary,
            elevation: 30,
            shadowColor: "#000",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: COLORS.white,
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <stack.Screen
        name="AiResult"
        component={Results}
        options={{
          headerTitle: "Consultation Results",
          headerLeft: () => (
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate("Aiconsultation")}
              >
                <Icon name="arrowleft" size={30} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            height: 120,
            backgroundColor: COLORS.primary,
            elevation: 30,
            shadowColor: "#000",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: COLORS.white,
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <stack.Screen
        name="Results"
        component={ConsultationResults}
        options={{
          headerTitle: "Consultation Results",
          headerLeft: () => (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate("payment")}>
                <Icon name="arrowleft" size={30} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            height: 120,
            backgroundColor: COLORS.primary,
            elevation: 30,
            shadowColor: "#000",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: COLORS.white,
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <stack.Screen
        name="profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="patient_profile"
        component={Patient_Profile}
        options={{
          headerShown: false,
          // headerTitle: "Pateint Profile",
          // headerLeft: () => (
          //   <View>
          //     <TouchableOpacity onPress={() => navigation.navigate("profile")}>
          //       <Icon name="arrowleft" size={30} color="black" />
          //     </TouchableOpacity>
          //   </View>
          // ),
          // headerStyle: {
          //   height: 120,
          //   backgroundColor: "#8BB85C",
          //   elevation: 30,
          //   shadowColor: "#000",
          // },
          // headerTitleAlign: "center",
          // headerTitleStyle: {
          //   color: COLORS.white,
          //   justifyContent: "center",
          //   alignItems: "center",
          // },
        }}
      />
      <stack.Screen
        name="notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="support"
        component={Support}
        options={{ headerShown: false }}
      />
      {/* Doctor Screens with Buttom Tab */}
      {/* <stack.Screen
        name="Schedule"
        component={ScheduleAppointment}
        options={{ headerShown: false }}
      /> */}
      {/* <stack.Screen
        name="mycalendar"
        component={Mycalendar}
        options={{ headerShown: false }}
      /> */}
      <stack.Screen
        name="history"
        component={ConsultationHistory}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="patientRecord"
        component={PatientRecord}
        options={{ headerShown: false }}
      />
      {/* End Doctor Screens */}

      <stack.Screen
        name="payment"
        component={Payment}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="card"
        component={Card}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="paypal"
        component={Paypal}
        options={{ headerShown: false }}
      />

      <stack.Screen
        name="chatting"
        component={ChattingStack}
        options={{
          headerShown:false
          // headerTitle: "Consultation",
          // headerLeft: () => (
          //   <View>
          //     <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          //       <Icon name="arrowleft" size={30} color="white" />
          //     </TouchableOpacity>
          //   </View>
          // ),
          // headerStyle: {
          //   height: 120,
          //   backgroundColor: "#8BB85C",
          //   elevation: 30,
          //   shadowColor: "#000",
          // },
          // headerTitleAlign: "center",
          // headerTitleStyle: {
          //   color: COLORS.white,
          //   justifyContent: "center",
          //   alignItems: "center",
          // },
        }}
      />
    </stack.Navigator>
  );
};

export default ConsultationStack;
