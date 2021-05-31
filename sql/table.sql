create table products (
  id          int           primary key auto_increment,
  name        varchar(50)   not null,
  description varchar(100)  not null,
  category    varchar(50)   not null,
  price       int           not null
);

insert into products (name, description, category, price) values ('Kayak', '1인용 보트', '수상스포츠', 275);
insert into products (name, description, category, price) values ('Lifejacket', '멋진 보호 장비', '수상스포츠', 48.95);
insert into products (name, description, category, price) values ('Soccer Ball', 'FIFA 인증 규격 및 무게', '축구', 19.5);
insert into products (name, description, category, price) values ('Corner Flags', '코너 플래그', '축구', 34.95);
insert into products (name, description, category, price) values ('Stadium', '35,000 좌석 경기장', '축구', 79500);
insert into products (name, description, category, price) values ('Thinking Cap', '두뇌 효율을 75% 개선', '체스', 16);
insert into products (name, description, category, price) values ('Unsteady Chair', '상대방에게 불리한 체스 의자', '체스', 29.95);
insert into products (name, description, category, price) values ('Human Chess Board', '가족이 하기에 즐거운 게임', '체스', 75);
insert into products (name, description, category, price) values ('Bling-Bling King', '금과 다이아몬드로 장식한 킹', '체스', 1200);

create table orders (
  id        int           primary key auto_increment,
  userid    varchar(50)   not null,
  address    varchar(50)   not null,
  giftwrap   boolean       null,
  date      datetime      not null
);

create table orderproducts (
  orderid   int  not null,
  productid int  not null,
  count     int  not null,
  price     numeric(10,2) not null,
  primary key (orderid, productid)
);