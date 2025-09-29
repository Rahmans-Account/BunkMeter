const Holidays = require("date-holidays");
const { getFunnyMessage } = require("./../utils/openai");
require("dotenv").config({ path: "./config.env" });
exports.getAttendance = (req, res) => {
  res.render("index");
};

exports.calculateAttendance = async (req, res) => {
  const { startDate, endDate, percentage } = req.body;

  const start_date = new Date(startDate);
  const end_date = new Date(endDate);
  const hd = new Holidays("IN", "TN");

  function all_holidays(start, end, hd) {
    let count = 0;
    let current1 = new Date(start);
    let current2 = new Date(start);

    while (current1 <= end) {
      let holiday = hd.isHoliday(current1);
      // if it's any kind of holiday
      if (holiday) {
        count++;
      }

      current1.setDate(current1.getDate() + 1);
    }
    //to add weekends
    while (current2 <= end) {
      // if it's weekend
      if (current2.getDay() === 0 || current2.getDay() === 6) {
        count += 1;
      }
      current2.setDate(current2.getDate() + 1);
    }

    return count;
  }
  if (start_date > new Date()) {
    return res.send("College Start kaniiiih🙏🙏🙏");
  }

  //total classes
  const total_holidays = all_holidays(start_date, end_date, hd) + 10; //10 is for better approximation
  const total_working_days =
    Math.ceil((end_date - start_date) / (1000 * 60 * 60 * 24)) +
    1 -
    total_holidays;
  const total_classes = total_working_days * 7;

  //total classes left for attending
  const working_days_left =
    Math.ceil((end_date - new Date()) / (1000 * 60 * 60 * 24)) +
    1 -
    all_holidays(new Date(), end_date, hd);

  const classes_left = working_days_left * 7;
  const current_attended_classes = Math.ceil(
    (percentage / 100) * (total_classes - classes_left)
  );

  //total classes needed for 75% attendance
  const required_attended_classes = Math.ceil((75 / 100) * total_classes);
  const remaining_classes_needed =
    required_attended_classes - current_attended_classes;
  const can_bunk = classes_left - remaining_classes_needed;
  const mess = await getFunnyMessage(can_bunk, percentage);
  //classes remaining
  if (can_bunk < 0) {
    return res.send("Sorry, It's highly  impossible to reach 75% attendance.");
  }
  const classes_perday = Math.ceil(
    remaining_classes_needed / working_days_left
  );
  if (classes_perday == 7) {
    return res.send(
      "You have to attend all the classes daily to reach 75% attendance."
    );
  }

  res.render("result", {
    bunk: can_bunk ?? 0, // or provide a default value/message
    remaining_working_days: working_days_left,
    classes_left: classes_perday,
    message: mess,
  });
};
