def test_root(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json() == {"message": "Flashcard API is running"}


def test_list_cards_empty(client):
    resp = client.get("/cards/")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_card(client):
    resp = client.post(
        "/cards/",
        json={"question": "2+2?", "answer": "4", "category": "Maths"},
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["question"] == "2+2?"
    assert body["answer"] == "4"
    assert body["category"] == "Maths"
    assert "id" in body and "created_at" in body


def test_create_card_defaults_category(client):
    resp = client.post("/cards/", json={"question": "Q", "answer": "A"})
    assert resp.status_code == 201
    assert resp.json()["category"] == "General"


def test_create_card_rejects_empty_question(client):
    resp = client.post("/cards/", json={"question": "", "answer": "A"})
    assert resp.status_code == 422


def test_list_cards_returns_created_cards_in_order(client):
    client.post("/cards/", json={"question": "Q1", "answer": "A1"})
    client.post("/cards/", json={"question": "Q2", "answer": "A2"})

    resp = client.get("/cards/")
    assert resp.status_code == 200
    questions = [c["question"] for c in resp.json()]
    assert questions == ["Q1", "Q2"]


def test_update_card(client):
    created = client.post("/cards/", json={"question": "Q", "answer": "A"}).json()

    resp = client.put(f"/cards/{created['id']}", json={"answer": "Updated"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["answer"] == "Updated"
    assert body["question"] == "Q"  # untouched fields are preserved


def test_update_missing_card_returns_404(client):
    resp = client.put("/cards/999999", json={"answer": "x"})
    assert resp.status_code == 404


def test_delete_card(client):
    created = client.post("/cards/", json={"question": "Q", "answer": "A"}).json()

    resp = client.delete(f"/cards/{created['id']}")
    assert resp.status_code == 204

    resp = client.get("/cards/")
    assert resp.json() == []


def test_delete_missing_card_returns_404(client):
    resp = client.delete("/cards/999999")
    assert resp.status_code == 404
