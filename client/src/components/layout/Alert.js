import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

/* This is a component connected to the store. 
Every time the store (state) changes by some action/reducer, this component will re-render and display the content.*/
// map trough all alerts in the state and display it in the UI (alerts is a state's array)
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key="{alert.id}" className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// mapping the state to the component's props
// getting the alert's state, putting it into prop of alerts
const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
