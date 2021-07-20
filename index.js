const express = require('express');
const {PrismaClient} = require('@prisma/client');
const SECRET = 'sdadkfdskmfdksmfkdmslkmkmkqewlkm';
const prisma = new PrismaClient();
const app = express();
let middleware = require('./middleware/auth');
var multer = require('multer');
var upload = multer({dest: 'public/files'});

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

app.use(express.json());

app.post(`/signup`, async (req, res) => {
  const {name, email} = req.body;

  const result = await prisma.user.create({
    data: {
      name,
      email,
      password: bcrypt.hashSync(req.body.password, 8),
    },
  });
  res.json(result);
});

app.post('/signin', async (req, res) => {
  const {email, password} = req.body;
  const user = await prisma.user.findUnique({
    where: {email: email},
    include: {
      likedArtPieces: true,
      myArtPieces: true,
      purchasedArtPieces: true,
      followers: true,
      following: true,
    },
  });
  console.log('user: ', user);
  if (user == null) {
    res.send(
      JSON.stringify({
        status: 404,
        error: 'No user with that email',
        token: null,
      })
    );
    return;
  }
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) {
    res.send(
      JSON.stringify({status: 404, error: 'Incorrect password', token: null})
    );
    return;
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    SECRET,
    {
      expiresIn: '1h',
    }
  );
  res.json({status: 200, error: null, token: token, user});
});

app.get('/delete', async (req, res) => {});

app.post(`/post`, middleware.checkToken, async (req, res) => {
  const {title, content, authorEmail} = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: {connect: {email: authorEmail}},
    },
  });
  res.json(result);
});

app.post('/uploadArtPiece', [middleware.checkToken], async (req, res) => {
  const {title, artistEmail, colors, medium, materials} = req.body;
  // const imageData = req.files;

  // console.log('this is image data', imageData[0].filename);
  const result = await prisma.artPiece.create({
    data: {
      title,
      colors,
      medium,
      materials,

      artist: {connect: {email: artistEmail}},
    },
  });
  res.json(result);
});

app.get('/artPiece', middleware.checkToken, async (req, res) => {
  const artPieces = await prisma.artPiece.findMany();
  res.json(artPieces);
});

app.get('/artPiece/:id', middleware.checkToken, async (req, res) => {
  const {id} = req.params;

  const artPiece = await prisma.artPiece.findUnique({
    where: {id: Number(id)},
  });
  res.json(artPiece);
});

app.get('/artPiece/artist/:id', middleware.checkToken, async (req, res) => {
  const {id} = req.params;

  const artPieces = await prisma.artPiece.findMany({
    where: {artistId: Number(id)},
  });
  res.json(artPieces);
});

app.put('/artPiece/like/:id', middleware.checkToken, async (req, res) => {
  const {id} = req.params;
  const {likerEmail} = req.body;
  try {
    const artPiece = await prisma.artPiece.update({
      where: {id: Number(id)},
      data: {
        liker: {connect: {email: likerEmail}},
      },
    });

    res.json(artPiece);
  } catch (error) {
    res.json({error: 'Doesnt exist in db'});
  }
});

app.put('/artPiece/purchase/:id', middleware.checkToken, async (req, res) => {
  const {id} = req.params;
  const {purchaserEmail} = req.body;
  try {
    const artPiece = await prisma.artPiece.update({
      where: {id: Number(id)},
      data: {
        purchaser: {connect: {email: purchaserEmail}},
      },
    });

    res.json(artPiece);
  } catch (error) {
    res.json({error: 'Doesnt exist in db'});
  }
});

app.put('/user/follow/:id', middleware.checkToken, async (req, res) => {
  const {id} = req.params;
  const {followerEmail} = req.body;
  try {
    const follower = await prisma.user.update({
      where: {id: Number(id)},
      data: {
        followers: {connect: {email: followerEmail}},
      },
    });

    res.json({status: 200, message: 'User followed succesfully'});
  } catch (error) {
    res.json({error: 'Doesnt exist in db'});
  }
});

app.put('/post/:id/views', async (req, res) => {
  const {id} = req.params;

  try {
    const post = await prisma.post.update({
      where: {id: Number(id)},
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    res.json(post);
  } catch (error) {
    res.json({error: `Post with ID ${id} does not exist in the database`});
  }
});

app.put('/publish/:id', async (req, res) => {
  const {id} = req.params;

  try {
    const postData = await prisma.post.findUnique({
      where: {id: Number(id)},
      select: {
        published: true,
      },
    });

    const updatedPost = await prisma.post.update({
      where: {id: Number(id) || undefined},
      data: {published: !postData.published || undefined},
    });
    res.json(updatedPost);
  } catch (error) {
    res.json({error: `Post with ID ${id} does not exist in the database`});
  }
});

app.delete(`/post/:id`, async (req, res) => {
  const {id} = req.params;
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(post);
});

app.get('/users', middleware.checkToken, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/user/:id/drafts', async (req, res) => {
  const {id} = req.params;

  const drafts = await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })
    .posts({
      where: {published: false},
    });

  res.json(drafts);
});

app.post('/single', upload.array('profile', 5), (req, res) => {
  try {
    res.send(req.files);
  } catch (err) {
    res.send(400);
  }
});

app.get(`/post/:id`, async (req, res) => {
  const {id} = req.params;

  const post = await prisma.post.findUnique({
    where: {id: Number(id)},
  });
  res.json(post);
});

app.get('/feed', async (req, res) => {
  const {searchString, skip, take, orderBy} = req.query;

  const or = searchString
    ? {
        OR: [
          {title: {contains: searchString}},
          {content: {contains: searchString}},
        ],
      }
    : {};

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...or,
    },
    include: {author: true},
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy || undefined,
    },
  });

  res.json(posts);
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
