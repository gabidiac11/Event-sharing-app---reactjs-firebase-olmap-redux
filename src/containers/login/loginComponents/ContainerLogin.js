import { connect } from "react-redux";
import LoginComponent from "./Login";
import { saveUserProfile, uploadImage } from "../ActionsLogin";

const mapStateProps = state => ({
  login: Object.assign({}, state.login)
});

const mapDispatchToProps = dispatch => ({
  onSaveUserProfile: payload => {
    dispatch(saveUserProfile(payload));
  },
  onUploadImage: payload => {
    dispatch(uploadImage(payload));
  }
});

const Login = connect(
  mapStateProps,
  mapDispatchToProps
)(LoginComponent);

export default Login;
