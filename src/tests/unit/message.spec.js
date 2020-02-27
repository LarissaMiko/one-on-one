import { mount, shallowMount } from '@vue/test-utils'
import MessageContainer from '@/components/MessageContainer.vue'

//tests for message container, participant is chatting 
describe('MessageContainer.vue', () => {
    const messages=[]
    const user="user1"
    const round_status='chat'   
    const partner={
        id: "user2",
        firstname: "Vorname2",
        lastname: "Nachname2",
        email: "test2@gmail.com",
        organisation: "LMU",
        country: "Germany",
        fieldOfActivity: "",
        researchInterest: [],
        pause: false,
        contactVisible: false
    }
   
    //div for chat, contact and interests given
    it('chat, contact or interests', () => {
        const wrapper = shallowMount(MessageContainer, {
            propsData: { 
                messages:messages,
                user:user,
                round_status:round_status, 
                partner:partner
            }
        })
        expect(wrapper.html()).toContain('<div class=\"col-4 m-1 p-2\"></div>')
    });

    //chat has send-message-button
    it('has a button', () => {
        const wrapper = shallowMount(MessageContainer, {
            propsData: { 
                messages:messages,
                user:user,
                round_status:round_status, 
                partner:partner
            }
        })
        expect(wrapper.contains('button')).toBe(true)
      })
 
    //chat partner don't pause while chatting
    it('no pause', () => {
        const wrapper = shallowMount(MessageContainer, {
            propsData: { 
                messages:messages,
                user:user,
                round_status:round_status, 
                partner:partner
            }
        })
        expect(wrapper.props().partner.pause).toBe(false)
        expect(wrapper.find('.noPartnerBreak').exists()).toBeTruthy()  
        expect(wrapper.find('.partnerBreak').exists()).toBeFalsy() 
    })

   //no chat partner availible
   it("no chat partner", () => {
    const wrapper = mount(MessageContainer, {
        propsData: { 
            messages:messages,
            user:user,
            round_status:round_status, 
            partner: { pause: true}
        }
    });
    expect(wrapper.props().partner.pause).toBe(true)
    expect(wrapper.find('.noPartnerBreak').exists()).toBeFalsy()  
    expect(wrapper.find('.partnerBreak').exists()).toBeTruthy()  
    })

    //running status is interest - interests are shown
   it("status interest", () => {
    const wrapper = mount(MessageContainer, {
        propsData: { 
            messages:messages,
            user:user,
            round_status:'interest', 
            partner: partner
        }
    });
    expect(wrapper.props().round_status).toBe('interest')
    expect(wrapper.find('.interestInfo').exists()).toBeTruthy()  
    expect(wrapper.find('.contactInfo').exists()).toBeFalsy()
    expect(wrapper.find('.chat-window').exists()).toBeFalsy()
    })

    //running status is chat - chatscontainer is shown
   it("status chat", () => {
    const wrapper = mount(MessageContainer, {
        propsData: { 
            messages:messages,
            user:user,
            round_status:'chat', 
            partner: partner
        }
    });
    expect(wrapper.props().round_status).toBe('chat')
    expect(wrapper.find('.interestInfo').exists()).toBeFalsy()  
    expect(wrapper.find('.contactInfo').exists()).toBeFalsy()
    expect(wrapper.find('.chat-window').exists()).toBeTruthy()
    })

    //running status is contact - contactdetails are shown
   it("status contact", () => {
    const wrapper = mount(MessageContainer, {
        propsData: { 
            messages:messages,
            user:user,
            round_status:'contact', 
            partner: partner
        }
    });
    expect(wrapper.props().round_status).toBe('contact')
    expect(wrapper.find('.interestInfo').exists()).toBeFalsy()  
    expect(wrapper.find('.contactInfo').exists()).toBeTruthy()
    expect(wrapper.find('.chat-window').exists()).toBeFalsy()
    })

    //Contact is visible
   it("show contact details", () => {
    const wrapper = mount(MessageContainer, {
        propsData: { 
            messages:messages,
            user:user,
            round_status:'contact', 
            partner: { contactVisible: true}
        }
    });
    expect(wrapper.props().partner.contactVisible).toBe(true)
    expect(wrapper.find('.contactFalse').exists()).toBeFalsy()  
    })

    //Contactdetails are not visible
   it("don't show contact details", () => {
    const wrapper = mount(MessageContainer, {
        propsData: { 
            messages:messages,
            user:user,
            round_status:'contact', 
            partner: { contactVisible: false}
        }
    }); 
    expect(wrapper.props().partner.contactVisible).toBe(false)
    expect(wrapper.find('.contactTrue').exists()).toBeFalsy()
    })
})