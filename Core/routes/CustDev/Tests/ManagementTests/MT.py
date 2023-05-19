import unittest
from unittest.mock import patch
from bson.objectid import ObjectId

class ManagementTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_add_promo_route(self):
        with patch('Manage.MngPromos.add_promo') as mock_add_promo:
            mock_add_promo.return_value = "Promo added successfully"
            response = self.client.post('/add-promo')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data.decode('utf-8'), "Promo added successfully")

    def test_delete_promo_route(self):
        promo_id = str(ObjectId())
        with patch('Manage.MngPromos.delete_promo') as mock_delete_promo:
            mock_delete_promo.return_value = "Promo deleted successfully"
            response = self.client.post(f'/delete-promo/{promo_id}')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data.decode('utf-8'), "Promo deleted successfully")

    def test_edit_promo_route(self):
        promo_id = str(ObjectId())
        with patch('Manage.MngPromos.edit_promo') as mock_edit_promo:
            mock_edit_promo.return_value = "Promo edited successfully"
            response = self.client.post(f'/edit-promo/{promo_id}')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data.decode('utf-8'), "Promo edited successfully")

    def test_edit_user_route(self):
        with patch('Manage.MngCusts.edit_user_route') as mock_edit_user_route:
            mock_edit_user_route.return_value = "User edited successfully"
            response = self.client.post('/edit_user')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data.decode('utf-8'), "User edited successfully")

    def test_delete_user_route(self):
        with patch('Manage.MngCusts.delete_user_route') as mock_delete_user_route:
            mock_delete_user_route.return_value = "User deleted successfully"
            response = self.client.post('/delete_user')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data.decode('utf-8'), "User deleted successfully")

if __name__ == '__main__':
    unittest.main()
