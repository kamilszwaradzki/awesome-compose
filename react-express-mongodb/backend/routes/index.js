const express = require("express");
const serverResponses = require("../utils/helpers/responses");
const messages = require("../config/messages");
const { JobApp } = require ("../models/jobapps/jobapp");

const routes = (app) => {
  const router = express.Router();

  router.param('jobapp_id', function (req, res, next, id) {
    // try to get the job application details from the JobApp model and attach it to the request object
    JobApp.findById(id).then((jobapp) => {
      req.jobapp = jobapp;
      next();
    })
    .catch((e) => {
      next(new Error(e));
    });
  })

  router.post("/jobapps", (req, res) => {
    const jobapp = new JobApp({
      text: req.body.text,
      whenApplied: req.body.whenApplied,
      from: req.body.from,
      description: req.body.description,
    });

    jobapp
      .save()
      .then((result) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });
  router.get("/", (req, res) => {
    JobApp.find({}, { __v: 0 })
      .then((jobapps) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, jobapps);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  router.patch("/jobapps/:jobapp_id", (req, res) => {
      req.jobapp.state = req.body.state;
      req.jobapp.save();
      serverResponses.sendSuccess(res, messages.SUCCESSFUL_UPDATE, {status: 'Update successfully.'});
  });
  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
