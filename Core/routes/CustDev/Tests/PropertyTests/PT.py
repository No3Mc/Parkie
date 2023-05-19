import unittest
from PropertyTests import User, Guest

class PropertyTest(unittest.TestCase):
    def test_user_attributes(self):
        user_dict = {'_id': '123', 'username': 'testuser', 'profile_icon_url': 'https://example.com/profile.png'}
        user = User(user_dict)
        self.assertEqual(user.id, '123')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.profile_icon_url, 'https://example.com/profile.png')
        self.assertTrue(user.is_active())

    def test_guest_attributes(self):
        guest_dict = {'_id': '456', 'username': 'testguest', 'profile_icon_url': None}
        guest = Guest(guest_dict)
        self.assertEqual(guest.id, '456')
        self.assertEqual(guest.username, 'testguest')
        self.assertIsNone(guest.profile_icon_url)
        self.assertFalse(guest.is_admin)
        self.assertTrue(guest.is_active())

    def test_user_set_profile_icon_url(self):
        user_dict = {'_id': '123', 'username': 'testuser', 'profile_icon_url': 'https://example.com/profile.png'}
        user = User(user_dict)
        self.assertEqual(user.profile_icon_url, 'https://example.com/profile.png')
        
        new_profile_icon_url = 'https://example.com/new_profile.png'
        user.set_profile_icon_url(new_profile_icon_url)
        self.assertEqual(user.profile_icon_url, 'https://example.com/new_profile.png')

    def test_guest_set_profile_icon_url(self):
        guest_dict = {'_id': '456', 'username': 'testguest', 'profile_icon_url': None}
        guest = Guest(guest_dict)
        self.assertIsNone(guest.profile_icon_url)
        
        new_profile_icon_url = 'https://example.com/new_profile.png'
        guest.set_profile_icon_url(new_profile_icon_url)
        self.assertEqual(guest.profile_icon_url, 'https://example.com/new_profile.png')

if __name__ == '__main__':
    unittest.main()

