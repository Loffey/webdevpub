import { HtmlTagHydration, insert_hydration_dev } from "svelte/internal";

export const videos = [
    {
        // Mörkt hjärta, 0
        "poster": "https://d2iltjk184xms5.cloudfront.net/uploads/photo/file/428872/5e28517303dbdd80ea40223600cea012-mo_CC_88rkt-hja_CC_88rta_6203c4686743f.jpg",
        "src": "https://drive.google.com/uc?id=1Ugm0-p6I981A2lcERS-7OMs9a7EVPZcO",
    },
    {
        // Aldrig vuxen, 1
        "poster": "https://eu1-prod-images.disco-api.com/2022/03/31/1c686d19-18d4-48de-87e0-249f73ae1776.jpeg?w=400&f=JPG&p=true&q=60",
        "src": "https://drive.google.com/uc?id=1rrgB-KQmfsDD7SVyKkFO2y_bPqnNTytx"
    },
    {
        // Alla mot alla, 2
        "poster": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoJDQ-VWe3r9li5REUic_wNOtmXPSq4SILdiTcctVWcu46h2fm",
        "src": "https://drive.google.com/uc?id=1WgLxq2S6P59YjomcDcPfRUSmoOIgvn2a"
    },
    {
        // The Island, 3
        "poster": "https://eu1-prod-images.disco-api.com/2022/03/29/52ae4c0f-6f31-38b6-b2fd-5b029dbed6e6.jpeg?w=400&f=JPG&p=true&q=60",
        "src": "https://drive.google.com/uc?id=1e8yTG1Db7iz2Da3BrCFcT5gMrX-t3KKU"
    },
    {
        // Vägens Hjältar, 4
        "poster": "https://eu1-prod-images.disco-api.com/2022/03/09/77cae89f-cc2b-43a8-9b7f-ec2ea6c60c63.jpeg?w=400&f=JPG&p=true&q=60",
        "src": "https://drive.google.com/uc?id=1EI49kyMfB3DBKZcayp8fPFIOtLXid3Xz"
    },
    {
        // Sommaren med släkten, 5
        "poster": "https://eu1-prod-images.disco-api.com/2022/01/21/bf849e10-6a3a-4223-99bc-8d67f67f30eb.jpeg?w=400&f=JPG&p=true&q=60",
        "src": "https://drive.google.com/uc?id=1ndqevcrtoOjrRdNu4RlNBe4QkAVJy_nY"
    },
    {
        // Building off the Grid, 6
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/16/8f283481-3b3f-47e8-b2be-411d6ab20d95.jpeg?w=800&f=JPG&p=true&q=60",
        "src": "https://drive.google.com/uc?id=1cyut1AB17XOPPmsLC562qwLE7MP9V8Wl"
    },
    {
        // Johnny vs. Amber, 7
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/13/f3cef8b8-a64a-32c6-bb74-beb6e70fabfe.jpeg?w=400&f=JPG&p=true&q=60",
        "src": "https://drive.google.com/uc?id=1nrhzJTdScfUzMyBCq92LP7IMELUuHLW3"
    },
    {
        // Huliganfallet, 8
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/09/4ec8f216-3ef1-34ae-b04c-3e85ec81a46a.jpeg?w=800&f=JPG&p=true&q=60"
    },
    {
        // Catching @killer, 9
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/16/6cd3eadf-990d-311b-b037-8636dc64adab.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // My Pack Life, 10
        "poster": "https://eu1-prod-images.disco-api.com/2022/04/30/cf6d21cc-b058-322b-9f85-420e4056a59c.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // The man without a heart, 11
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/03/6dcc2616-00aa-37ed-be0e-a1b59aa8b7a0.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Invensions, 12
        "poster": "https://eu1-prod-images.disco-api.com/2022/04/20/bf106191-7588-3c13-98be-28da8c20d7f4.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Kevin Hart, 13
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/13/1d647135-8b33-3c56-92d4-295952a2fbe4.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Ensam i vildmarken, 14
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/b1090980-f226-3b9e-ae97-df34c17b6c0d.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Över Atlanten, 15
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/19203b3a-953f-3d1c-a16e-92b60da9c61a.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Deadliest Catch, 16
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/17/c4f80db1-26d9-4daa-b98e-ecf89f0a1a53.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Ed Stafford, 17
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/6aafeebb-ec5e-3330-9cc9-79fc4b66a430.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Everest, 18
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/addc8596-54b4-337d-a8d6-94c482bb1465.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Impossible Row, 19
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/6dff37bb-32e8-3b64-8e76-7e7abec949ae.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Vi i Villa, 20
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/03/f5f3a7fd-047e-3b90-acae-1b907572f2b4.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Dopamin, 21
        "poster": "https://eu1-prod-images.disco-api.com/2022/04/21/0d2e703c-7db9-3788-be62-fc9c76c58b05.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // LIGGA, 22
        "poster": "https://eu1-prod-images.disco-api.com/2021/12/22/0c83c76d-bfe0-43ae-9c56-1f73aa035229.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Pappas Pojkar, 23
        "poster": "https://eu1-prod-images.disco-api.com/2021/12/06/eed32bdc-0d35-4a4b-8724-7b7158fcb0e2.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Udda veckor, 24
        "poster": "https://eu1-prod-images.disco-api.com/2022/03/01/a8c64ce7-008c-4a96-b7de-a3a41601d826.png?w=400&f=JPG&p=true&q=60"
    },
    {
        // Rönnäsfallet, 25
        "poster": "https://eu1-prod-images.disco-api.com/2021/12/01/74d512be-426d-36c8-8d1f-d6b4cf175e1c.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Ted Bundy, 26
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/23/755c8929-a6c9-39cf-b19e-8661389507a6.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Insats Torsk, 27
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/40f0fb08-f334-378a-adc4-c642f8118852.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Joakim Lundell, 28
        "poster": "https://eu1-prod-images.disco-api.com/2021/12/01/3573c7d3-b666-3d27-806c-388635ed7805.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Tunnelbanan, 29
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/b6a0e0ab-23ab-36ec-88fb-06f8bed5e25e.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Murder Tapes, 30
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/aab292ba-52ff-3864-bf1c-8a6fbd80ca7c.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Välkommen till köping, 31
        "poster": "https://eu1-prod-images.disco-api.com/2022/01/26/59683a62-2e15-47f8-9924-de6e84f2e376.jpeg?w=400&f=JPG&p=true&q=60",
        "src": "https://drive.google.com/uc?id=1Ih6Kq-1XAWzfVcOIWJpKKn7AauvRSN0C"
    },
    {
        // Top Gear, 32
        "poster": "https://eu1-prod-images.disco-api.com/2021/12/09/5defb86e-aa15-42ac-a500-0324003e345f.jpeg?w=400&f=JPG&p=true&q=60",
        "src": "https://drive.google.com/uc?id=1KnTmb0YVYEfwa1h9mLnvkLCKR5pEnqpm"
    },
    {
        // Ullared, 33
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/23/44a8e39d-eb1a-3515-b888-c28180e216c8.jpeg?w=400&f=JPG&p=true&q=60",
        "src": "https://drive.google.com/uc?id=1YdEtbEUi5iPihMsJaKEnEU8vJki1HY6r"
    },
    {
        // Calls from the inside, 34
        "poster": "https://eu1-prod-images.disco-api.com/2022/04/04/794f29df-8b04-3c59-a480-a9b7702378dd.jpeg?w=800&f=JPG&p=true&q=60"
    },
    {
        // Building the legend, 35
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/20/661b9c03-7ae3-4c77-b388-3d237928d7db.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Love in the jungle, 36
        "poster": "https://eu1-prod-images.disco-api.com/2022/05/20/f817b27a-2789-4365-8856-2acf5712cdab.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Survive that, 37
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/affdeabe-3cac-37b6-83c6-1d6ba38e58fc.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // 100 days, 38
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/880ff7f2-4de0-3164-aacb-ae6c9dc474b7.jpeg?w=400&f=JPG&p=true&q=60"
    },
    {
        // Puching the line, 39
        "poster": "https://eu1-prod-images.disco-api.com/2021/11/23/983e4734-281c-3cbb-b891-fb0cdef24d79.jpeg?w=400&f=JPG&p=true&q=60"
    }
]