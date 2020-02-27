import { mount, shallowMount } from '@vue/test-utils'
import Timer from '@/components/Timer.vue'

//tests for timer
describe('Timer.vue', () => {
  const session = {
    endDate:"Fri Feb 14 2020 19:59:00 GMT+0100 (Mitteleuropäische Normalzeit)",
    event_id: "valentines_0",
    round: 2,
    rounds: 3,
    startDate: "Fri Feb 14 2020 17:19:00 GMT+0100 (Mitteleuropäische Normalzeit)"
  }  
  const session_status = "running"
  const round_status = "contact"
  
  //max of progress-bar of contact, chat and interests
  it("time 100% percent progress", () => {
    const wrapper = mount(Timer, {
      propsData: { 
        session:session,
        session_status: session_status,
        round_status: round_status 
      }
    });
    expect(wrapper.find('#progressBarContact').attributes('max')).toEqual("30");
    expect(wrapper.find('#progressBarChat').attributes('max')).toEqual("120");
    expect(wrapper.find('#progressBarInterests').attributes('max')).toEqual("30");
  });

  //test timer interval
  it("timer interval 100%", () => {
    expect(typeof Timer.data).toBe('function')
    const defaultData = Timer.data()
    expect(defaultData.intervalpercent).toBe(100)
  });

  //upcoming event is not running event and not expired event
  it("event status upcoming", () => {

    const wrapper = shallowMount(Timer, {
      propsData: { 
        session:{
          endDate:"Mon Feb 14 2022 19:59:00 GMT+0100 (Mitteleuropäische Normalzeit)", 
          event_id: "speedUp",
          round: 2,
          rounds: 3,
          startDate: "Mon Feb 14 2022 17:19:00 GMT+0100 (Mitteleuropäische Normalzeit)"
        },
        session_status: "upcoming",
        round_status: round_status 
      }
    });
 //   expect(wrapper.classes()).toBe('upcomingevent');
    expect(wrapper.classes('runningevent')).toBe(false);
    expect(wrapper.classes('expiredevent')).toBe(false);
});


  //headline One-on-One Chat
  it('headline One-on-One Chat', () => {
    const wrapper = shallowMount(Timer, {
      probsData: {
        session: session,
        session_status: session_status,
        round_status: round_status
      }
    });
    expect(wrapper.html()).toContain('<h1 class="col-5 m-1 p-2 title">One-on-One Chat</h1>')
  })

  // timer is find
  it("shows timer", () => {
    const wrapper = mount(Timer, {
      propsData: { 
        session: session,
        session_status: session_status,
        round_status: round_status      
      }
    });
    expect(wrapper.find('Timer')).toBeTruthy();
  });

})