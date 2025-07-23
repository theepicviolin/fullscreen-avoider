'use strict';

import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import { MonitorsConfig } from './monitors.js';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class FullscreenAvoiderPreferences extends ExtensionPreferences {
	fillPreferencesWindow(window) {
		let settings = this.getSettings();
		const page = Adw.PreferencesPage.new();

		const group = Adw.PreferencesGroup.new();
		group.set_title(_("Settings"));
		this._monitorsConfig = new MonitorsConfig();
    	

		page.add(group);

		group.add(buildSwitcher(settings, 'move-hot-corners', _('Move Hot Corners:')));
		group.add(buildSwitcher(settings, 'move-notifications', _('Move Notifications:')));

		this._dropdownObj = buildDropdown(settings, 'preferred-monitor', _('Preferred Monitor:'));

		let i = settings.get_int('preferred-monitor') + "";
		this._dropdownObj.subtitle = "Last set to: " + i;

		let expanderRow = new Adw.ExpanderRow({
			title: i,
		});
		//expanderRow.add_row(this._dropdownObj);

		//group.add(expanderRow)
		
		group.add(this._dropdownObj);
		
		this._monitorsConfig.connect('updated', () => this.updateMonitors());
		//settings.set_int('preferred-monitor', i);

		window.add(page)
		this.updateMonitors();
	}

	updateMonitors() {
		let monitors = this._monitorsConfig.monitors;
		let count = monitors.length;
		let list = new Gtk.StringList();
		list.append('Primary Monitor');
		for (let i = 0; i < count; i++) {
		  let m = monitors[i];
		  //list.append(m.displayName);
		  if (m.isPrimary) {
			list.append("Primary" + i.toString());
		  } else {
			list.append(i.toString());
		  }
		  
		}
		this._dropdownObj.get_activatable_widget().set_model(list);
	}	
}

function buildDropdown(s, key, labeltext) {
	let adwrow = new Adw.ActionRow({
		title: labeltext,
	});
	
	const dropdown = Gtk.DropDown.new_from_strings([])

	s.bind(key, dropdown, 'selected', Gio.SettingsBindFlags.DEFAULT);

	   adwrow.add_suffix(dropdown);
	adwrow.activatable_widget = dropdown;

	return adwrow;
}

function buildSwitcher(settings, key, labeltext) {
	let adwrow = new Adw.ActionRow({
		title: labeltext,
	});
	const switcher = new Gtk.Switch({
		active: settings.get_boolean(key),
		valign: Gtk.Align.CENTER,
	});

	settings.bind(key, switcher, 'active', Gio.SettingsBindFlags.DEFAULT);

	adwrow.add_suffix(switcher);
	adwrow.activatable_widget = switcher;

	return adwrow;
}

