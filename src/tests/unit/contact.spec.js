import { mount, shallowMount } from '@vue/test-utils'
import Contact from '@/components/MessageContainer.vue'

//tests for show contactdetails
describe('Contact.vue', () => {
  const messages=[]
  const user="user1"
  const round_status='contact'   
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
    //props round_status contact, contactdetail not visible
    it('Contact container is open', () => {
      const wrapper = shallowMount(Contact, {
        propsData: {
          messages:messages,
          user:user,
          round_status: round_status,
          partner:partner
        }
      })
      expect(wrapper.props().round_status).toBe('contact')
      expect(wrapper.props().messages).toStrictEqual([])
      expect(wrapper.props().partner.contactVisible).toBe(false)
    })

    //yes-button exist, text is "Yes"
    it('Button yes',() => {
      const wrapper = shallowMount(Contact, {
        propsData: {
          messages:messages,
          user:user,
          round_status: round_status,
          partner:partner
        }
      })
    expect(wrapper.html()).toContain('<div id="buttons" class="contactquestion">')
    let buttonyes = wrapper.find('.btn');
    expect(buttonyes.text()).toBe('Yes')  
  })
  
  //buttonclick shows contacts
  it('button click should show the contacts', () => {
    const wrapper = shallowMount(Contact, {
      propsData: {
        messages:messages,
        user:user,
        round_status: round_status,
        partner:partner
      }
    })
    const button = wrapper.find('button')
    button.trigger('click')
    expect(wrapper.contains('.showContacts')).toBe(true);
  })
})