import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  centerToLeft:{
    flexDirection: "row",
    justifyContent: "flex-start", 
    width:'100%', 
    marginLeft:60, 
    marginVertical:0
  },
  loadingScreen:{
    backgroundColor:'black',
    height:'100%',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  description: {
    fontSize: 16,
    color: "gray",
  
  },
  subtitleBig: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#3D4AF5",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    overflow: "scroll",
  },
  instructorImage: {
    width: 120,
    height: 120,
    marginLeft: 10,
    paddingBottom: 10,
    resizeMode: "contain",
    borderRadius: 30,
  },
  instructorImageClass: {
    width: 50,
    height: 50,
    marginLeft: 0,
    resizeMode: "contain",
    borderRadius: 50,
  },
  containerInside: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 75,
  },
  inputView: {
    borderRadius: 14,
    width: "100%",
    height: 45,
    marginBottom: 20,
    borderColor: "#CDCDCD",
    borderStyle: "solid",
    borderWidth: 1,
  },
  label: {
    color: 'gray',
    marginBottom:6,
    marginLeft: 13,
    fontSize: 12
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  primaryButton: {
    width: "100%",
    borderRadius: 16,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    backgroundColor: "#000",
    color: "#ffffff",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontWeight:'500',
    fontSize: 16
  },

  instructorCard: {
    backgroundColor: "#F5F8FE",
    borderRadius: 24,
    padding: 30,
    height: 170,
    width: "100%",
    maxWidth: 390,
    marginRight: 10,
    marginBottom: 10,
  },
  titleText: {
    color: "#000",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  half: {
    width: "50%",
  },
  footer: {
    color: "#000",
    marginTop: 20,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  flex: {
    flexDirection: "row",
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 16,
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#CDCDCD",
  },

  secondaryButtonText: {
    color: "#000",
    fontWeight: '400',
    fontSize: 16
  },

  oauthView: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#CDCDCD",
    marginBottom: 20,
  },

  logoSignUp: {
    display: "flex",
    justifyContent: "center",
  },
  paragraph: {
    fontSize: 16,
  },
  center: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
  },
  heading: {
    display: "flex",
    gap: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    textAlign: "left",
    width: "100%",
    marginLeft: 60,
    marginBottom: 6,
  },
  box: {
    backgroundColor: "#141414",
    borderRadius: 24,
    padding: 25,
    height: 165,
    width: 175,
  },
  spaceBet: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  spaceBetCol: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
