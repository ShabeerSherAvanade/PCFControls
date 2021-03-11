import * as React from 'react';
import {Callout, DatePicker, DayOfWeek, IDatePicker, IDatePickerStrings, mergeStyleSets, PrimaryButton, Stack, TextField} from 'office-ui-fabric-react';

export interface IDate {
  currentDate: Date | undefined;
  isDateOnly: boolean;
}
export interface IDateControlProps extends IDate{
    onDateChanged:(date:IDate) => void;

}
interface IDateControlState extends IDate{
}

const DayPickerStrings: IDatePickerStrings = {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  
    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    closeButtonAriaLabel: 'Close date picker',
    monthPickerHeaderAriaLabel: '{0}, select to change the year',
    yearPickerHeaderAriaLabel: '{0}, select to change the month',
  
    isRequiredErrorMessage: 'Start date is required.',
  
    invalidInputErrorMessage: 'Invalid date format.',
  };

  const controlClass = mergeStyleSets({
    control: {
      margin: '0 0 15px 0',
      maxWidth: '300px',
    },
  });
  const onFormatDate = (date?: Date): string => {
    return !date ? '' : date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() % 100);
  };

  
const desc = 'This field is required. One of the support input formats is year dash month dash day.';

const firstDayOfWeek = DayOfWeek.Sunday;



export default class DateControl extends React.Component<IDateControlProps, IDateControlState>{
    
    constructor(props:IDateControlProps){
        super(props);
        this.state = {
            currentDate : props.currentDate,
            isDateOnly: props.isDateOnly
        };
    }

    private setDate = (date:Date) =>{
      console.log(date);
      this.setState({
        currentDate: date
      }, this.onDateChanged)
    }

    private onDateChanged = () =>{
      const date: IDate={
        currentDate:this.state.currentDate,
        isDateOnly:this.state.isDateOnly
      };
      this.props.onDateChanged(date);
      
    }

    private getCurrentDate = () =>{
      //If IsDateOnly is equal to False, then we know we are dealing with DateAndTime and set isDateAndTime to true otherwise it's Date
      var isDateAndTime = this.state.isDateOnly === false ? true : false;
      var systemDate = new Date();
      var year = systemDate.getFullYear();
      var month = systemDate.getMonth();
      var day = systemDate.getDate();
      var hour = systemDate.getHours();
      var minute = systemDate.getMinutes();
      if(isDateAndTime != true) //We are dealing with Date only
      {
        console.log("Date only");
        if(year != null && month != null && day != null)
        {
          this.setDate(new Date(year, month, day));
        }
      }
    }

    render(){
        return(
            <div>
                <Stack horizontal> 
                    <Stack tokens={{childrenGap:10, padding:10}}>
                        <DatePicker 
                            className={controlClass.control}
                            isRequired={false}
                            allowTextInput={true}
                            ariaLabel={desc}
                            firstDayOfWeek={firstDayOfWeek}
                            onSelectDate = {(selected => {
                              console.log("selected Date:"+selected)
                              this.setState({
                                currentDate: selected ?? undefined                                
                              },this.onDateChanged)
                            })}
                            value={this.state.currentDate }
                        />
                    </Stack>
                    <Stack tokens={{childrenGap:10, padding:10}}>
                        <PrimaryButton 
                                text={"Current Date"}
                                onClick={this.getCurrentDate}
                            />
                    </Stack>
                </Stack>
                
            </div>
        )
    }
}
