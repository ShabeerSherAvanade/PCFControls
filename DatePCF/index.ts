import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DateControl, {IDateControlProps, IDate} from './DateTImeControl/DateControl'
import {initializeIcons} from '@fluentui/react/lib/Icons';
import {ITimeProps} from "./DateTImeControl/TimeBox"

export class DatePCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private container: HTMLDivElement;
	private currentDate: IDate;
	private _hourvalue: number | undefined;
	private _minutevalue: number | undefined;
	private _notifyOutputChanged: () => void;
	private _props: ITimeProps = { hourvalue : undefined, 
		minutevalue : undefined,
		readonly:false,
		masked:false, 
		format:"h:mm a",
		use12Hours:true,
		//onChange : this.notifyChange.bind(this) 
	};

	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		initializeIcons();
		this.container = container;
		this._notifyOutputChanged = notifyOutputChanged;
		this.renderControl(context);
		

		// Add control initialization code
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this.renderControl(context);
		// Add code to update control view
	}

	private renderControl(context:ComponentFramework.Context<IInputs>):void{
		const currentDate = new Date(context.parameters.CurrentDate.raw ?? "");
		
		// If the bound attribute is disabled because it is inactive or the user doesn't have access
		let isReadOnly = context.mode.isControlDisabled;

		let isMasked = false;
		// When a field has FLS enabled, the security property on the attribute parameter is set
		/*
		if (context.parameters.hourvalue.security) {
			isReadOnly = isReadOnly || !context.parameters.hourvalue.security.editable;		
			isMasked = !context.parameters.hourvalue.security.readable
		}
		*/
		this._hourvalue = context.parameters.hourvalue.raw !== null ? context.parameters.hourvalue.raw : undefined;
		this._minutevalue = context.parameters.minutevalue.raw !== null ? context.parameters.minutevalue.raw : undefined;
		let display = context.parameters.displaytype.raw;
		//update the props
		
		this._props.hourvalue = this._hourvalue;
		this._props.minutevalue = this._minutevalue;
		this._props.readonly = isReadOnly;
		this._props.masked = isMasked;
		this._props.use12Hours = display === "12 hrs";
		this._props.format = display === "12 hrs" ? "h:mm a" : "k:mm";


		const compositeDateControlProps: IDateControlProps = {
			isDateOnly: context.parameters.CurrentDate.type === "DateAndTime.DateOnly" ? true : false,
			currentDate: context.parameters.CurrentDate.raw ?? undefined,
			hourvalue:this._hourvalue,
			minutevalue:this._minutevalue,
			readonly: this._props.readonly,
			masked: this._props.masked,
			format:this._props.format,
			use12Hours:this._props.use12Hours,
			hourValue: context.parameters.hourvalue.raw ?? undefined,
			onDateChanged:(d:IDate) => {
				this.currentDate = d;
				if(context.parameters.CurrentDate.type === "DateAndTime.DateOnly")
				{
					console.log("Date only");
				}
				else{
					console.log("Date Time perhaps");
				}
				this._notifyOutputChanged();
			}
		};

		ReactDOM.render(React.createElement(DateControl, compositeDateControlProps,this._props), this.container);
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			CurrentDate: this.currentDate.currentDate,
			hourvalue: this._hourvalue,
			minutevalue: this._minutevalue
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		ReactDOM.unmountComponentAtNode(this.container);
		// Add code to cleanup control if necessary
	}

		//Function called when props is signaling an update
		private notifyChange(hourvalue:number|undefined, minutevalue:number|undefined) {
		
			this._hourvalue = hourvalue;
			this._minutevalue = minutevalue;
			this._notifyOutputChanged();  //=> will trigger getOutputs
		}
}