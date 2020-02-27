import { mount, shallowMount } from '@vue/test-utils'
import MessageContainer from '@/components/MessageContainer.vue'

//tests for message container, participant is chatting 
describe('MessageContainer.vue', () => {
    const messages=[]
    const user="user1"
    const round_status='interest'   
    const partner={
        id: "user2",
        firstname: "Vorname2",
        lastname: "Nachname2",
        email: "test2@gmail.com",
        organisation: "LMU",
        country: "Germany",
        fieldOfActivity: "",
        researchInterest: ["Lokomotiven","Elefanten", "Bienen"],
        pause: false,
        contactVisible: false
    }

    //div for chat, contact and interests given
    it('shows interests of chatpartner', () => {
        const wrapper = shallowMount(MessageContainer, {
            propsData: { 
                messages:messages,
                user:user,
                round_status:round_status, 
                partner:partner
            }
        })
        expect(wrapper.props().round_status).toBe('interest')
        expect(wrapper.html()).toContain(' <div class="col-4 m-1 p-2 interestInfo">')
    })
    
    //div for chat, contact and interests given
    it('shows interests of chatpartner', () => {
        const wrapper = shallowMount(MessageContainer, {
            propsData: { 
                messages:messages,
                user:user,
                round_status:round_status, 
                partner:partner
            }
        })
        expect(wrapper.props().round_status).toBe('interest')
        expect(wrapper.html()).toContain(' <div class="col-4 m-1 p-2 interestInfo">')
    })

})