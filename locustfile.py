from locust import HttpUser, task, between
import random

class AssistantUser(HttpUser):
    # 模擬每次請求間的等待時間 (1~3 秒)
    wait_time = between(1, 3)

    @task
    def post_to_assistant(self):
        # 測試的 API 路徑
        # url = "/assistant"
        url = ""
        
        # 模擬的 JSON 請求數據
        payload = {
            "message": random.choice([
                "Hello, how are you?",
                "Tell me a joke.",
                "What's the weather today?",
                "How about Nvidia?",
                "Can I buy Apple stock?."
            ])
        }

        # 發送 POST 請求
        with self.client.post(url, json=payload, catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed! Status Code: {response.status_code}")
