import { mount, shallowMount } from '@vue/test-utils'
import Timer from '@/components/Timer.vue'

//tests for status
describe('Timer.vue', () => {
    const session = {
      endDate:"Fri Feb 14 2020 19:59:00 GMT+0100 (Mitteleuropäische Normalzeit)",
      event_id: "valentines_0",
      round: 2,
      rounds: 3,
      startDate: "Fri Feb 14 2020 17:19:00 GMT+0100 (Mitteleuropäische Normalzeit)"
    }  
    const round_status = "contact"
    
    //upcoming event
    it("status is upcoming", () => {
      const wrapper = mount(Timer, {
        propsData: { 
          session:session,
          session_status: 'upcoming',
          round_status: round_status 
        }
      });
      expect(wrapper.html()).toContain('<div class="time bg-black upcomingEventTime">')
      expect(wrapper.find('.runningevent').exists()).toBeFalsy()  
      expect(wrapper.find('.upcomingevent').exists()).toBeTruthy()
      expect(wrapper.find('.expiredevent').exists()).toBeFalsy()  
    });

    //expired event
    it("status is expired", () => {
        const wrapper = mount(Timer, {
          propsData: { 
            session:session,
            session_status: 'expired',
            round_status: round_status 
          }
        });
        expect(wrapper.html()).toContain('<p class="time">Your chat is over</p>')
        expect(wrapper.find('.runningevent').exists()).toBeFalsy()  
        expect(wrapper.find('.expiredevent').exists()).toBeTruthy()  
        expect(wrapper.find('.upcomingevent').exists()).toBeFalsy()  
    });

    //running event
    it("status is running", () => {
        const wrapper = mount(Timer, {
          propsData: { 
            session:session,
            session_status: 'running',
            round_status: round_status 
          }
        });
        expect(wrapper.html()).toContain('<div class="time">')
        expect(wrapper.find('.runningevent').exists()).toBeTruthy()  
        expect(wrapper.find('.expiredevent').exists()).toBeFalsy() 
        expect(wrapper.find('.upcomingevent').exists()).toBeFalsy()   
    });
})