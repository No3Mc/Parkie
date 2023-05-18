import unittest
from unittest.mock import patch, MagicMock
from app import app, User

class AppTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'index.html', response.data)

    def test_login_route(self):
        response = self.app.post('/login', data={'username': 'testuser', 'password': 'password'})
        self.assertEqual(response.status_code, 401)
        self.assertIn(b'Login failed', response.data)

    @patch('app.user_collection')
    def test_load_user(self, mock_user_collection):
        user_id = '123'
        user_dict = {'_id': user_id, 'username': 'testuser'}
        mock_user_collection.find_one.return_value = user_dict
        user = app.load_user(user_id)
        self.assertIsInstance(user, User)
        self.assertEqual(user.id, user_id)
        self.assertEqual(user.username, 'testuser')


if __name__ == '__main__':
    unittest.main()

