from django.test import TestCase
from rest_framework.authtoken.models import Token
from users.models import Trader
from trader.models import Note
from .test_data import NoteData


class NotesTests(TestCase):
    def setUp(self) -> None:
        self.test_data = NoteData
        self.trader = Trader.objects.create(
            email='sonugademilade8703@gmail.com',
            password='password'
        )
        token = Token.objects.create(user=self.trader).key
        self.headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {token}'
        }
    
    def test_get_notes(self):
        for note in self.test_data.some_existent_notes:
            Note.objects.create(
                user=self.trader,
                title=note['title'],
                content=note['content'],
                last_edited=note['last_edited']
            )
        resp = self.client.get('/trader/get-all-notes/', **self.headers)
        self.assertEquals(resp.status_code, 200)
        for i, note in enumerate(resp.json()):
            note1 = note
            note2 = self.test_data.some_existent_notes[i]
            self.assertJSONEqual(note1['content'], note2['content'])
            self.assertEqual(note1['title'], note2['title'])
            self.assertEqual(note1['last_edited'][:-1], note2['last_edited'][:-6])

    def test_save_note(self):
        self.assertEquals(Note.objects.all().count(), 0)
        resp = self.client.post('/trader/save-note/', self.test_data.unsaved_note, **self.headers)
        self.assertEquals(resp.status_code, 201)
        self.assertEquals(Note.objects.all().count(), 1)
        newly_saved_note = Note.objects.all()[0]
        note_data = self.test_data.unsaved_note
        self.assertJSONEqual(newly_saved_note.content, note_data['content'])
        self.assertEqual(newly_saved_note.title, note_data['title'])
        self.assertEquals(newly_saved_note.last_edited.isoformat(), note_data['lastEdited'])
        self.assertEquals(resp.json()['id'], newly_saved_note.id)
    
    def test_update_note(self):
        existent_note = Note.objects.create(user=self.trader, **self.test_data.existent_note)
        self.assertEquals(Note.objects.all().count(), 1)
        resp = self.client.put(f'/trader/save-note/{existent_note.id}/',
            self.test_data.updated_existent_note,
            content_type='application/json',
            **self.headers
        )
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(Note.objects.all().count(), 1)
        updated_note = Note.objects.all()[0]
        self.assertEquals(updated_note.title, self.test_data.updated_existent_note['title'])
        self.assertJSONEqual(updated_note.content, self.test_data.updated_existent_note['content'])
        self.assertNotEquals(updated_note.last_edited, self.test_data.updated_existent_note['lastEdited'])

    def test_delete_note(self):
        note = Note.objects.create(user=self.trader, **self.test_data.existent_note_to_delete)
        self.assertEquals(Note.objects.all().count(), 1)
        resp = self.client.delete(f'/trader/delete-note/{note.id}/', **self.headers)
        self.assertEquals(resp.status_code, 204)
        self.assertEquals(Note.objects.all().count(), 0)
    