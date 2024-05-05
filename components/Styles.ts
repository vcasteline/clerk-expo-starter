import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3D4AF5",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 70,
    overflow:"scroll",
  },
  instructorImage:{
    width: 130,
    height: 130,
    marginLeft: 10,
    resizeMode: "contain",
    borderRadius: 50
  },
  containerInside: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 70,
  },
  inputView: {
    borderRadius: 5,
    width: "100%",
    height: 45,
    marginBottom: 20,
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: 1,
  },

  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  primaryButton: {
    width: "100%",
    borderRadius: 15,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    backgroundColor: "#000",
    color: "#ffffff",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  instructorCard: {
    backgroundColor:"#F5F8FE",
    borderRadius: 24,
    padding: 30,
    height: 200,
    marginRight: 10
  },
  titleText: {
    color: "#000",
    fontSize:26,
    fontWeight: "bold",
    marginBottom: 10,
  },

  footer: {
    color: "#000",
    marginTop: 20,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  secondaryButton: {
    marginTop: 15,
    borderRadius: 15,
    width: "100%",
    height:40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000",
  },

  secondaryButtonText: {
    color: "#000",
    fontWeight: "bold",
  },

  oauthView: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 20,
  },

  logoSignUp: {
    display:"flex",
    justifyContent:"center"
  },
  paragraph: {
    fontSize: 16,
  },
  center: {
    flexDirection:"row",
    justifyContent:"center",
    gap: 8
  },
  box:{
    backgroundColor: "#141414",
    borderRadius: 24,
    padding:30,
    height: 175,
    width: 175
  },
  spaceBet: {
    flexDirection:"row",
    justifyContent: "space-between",
    gap: 10
  },
});
