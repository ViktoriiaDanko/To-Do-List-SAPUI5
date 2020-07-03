sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/DisplayListItem"
], function (Controller, DisplayListItem) {
	"use strict";
	var aTasks = {};

	return Controller.extend("list.ToDoList.controller.App", {
		onInit: function () {
			this._loadTasks();
			this._populateList();
		},

		addTask: function (oEvent) {
			var oButton = this.getView().byId("addTask");
			oButton.setEnabled(!!oEvent.getParameter("value"));
		},

		onPressAddTask: function (oEvent) {
			var oInput = this.getView().byId("inputAddTask");
			var oButton = this.getView().byId("addTask");

			var sTask = oInput.getValue();

			if (sTask) {
				var task = this._addTask(sTask);

				this._createListItem(task);
				oInput.setValue("");

				oButton.setEnabled(false);
			}
		},

		onDeleteItem: function (oEvent) {
			this._deleteListItem(oEvent.getParameter("listItem"));
		},

		_addTask: function (sTaskDescription) {
			var id = Date.now();
			aTasks[id] = {
				id: id,
				t: sTaskDescription
			};

			this._saveTasks();
			return aTasks[id];
		},

		_deleteTask: function (id) {
			delete aTasks[id];
			this._saveTasks();
		},

		_loadTasks: function () {
			var json = localStorage.getItem("tasks");

			try {
				aTasks = JSON.parse(json) || {};
			} catch (e) {
				jQuery.sap.log.error(e.message);
			}
		},

		_saveTasks: function () {
			localStorage.setItem("tasks", JSON.stringify(aTasks));
		},

		_populateList: function () {
			for (var id in aTasks) {
				this._createListItem(aTasks[id]);
			}
		},

		_createListItem: function (mTask) {
			var oListTodo = this.getView().byId("listTodo");

			var listItem = new DisplayListItem({
				label: mTask.t
			}).data("id", mTask.id);

			oListTodo.addAggregation("items", listItem);
		},

		_deleteListItem: function (oListItem) {
			var oListTodo = this.getView().byId("listTodo");
			var id = oListItem.data("id");

			oListTodo.removeAggregation("items", oListItem);
			this._deleteTask(id);
		}
	});
});