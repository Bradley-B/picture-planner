<style>
  * {
      font-family: sans-serif;
  }

  .page {
      height: 100%;
      overflow: auto;
  }

  .content {
      margin: 50px;
      height: fit-content;
  }

  h1 {
      margin-bottom: 30px;
  }

  img {
      display: block;
      margin: 0 auto 0 auto;
      max-width: 100%;
  }

  p {
      white-space: pre-line;
      line-height: 175%;
      width: 100%;
  }

  .button {
      margin: 20px 0 50px 0;
      padding: 20px 30px 20px 30px;
      background-color: #534D41;
      border-radius: 5px;
      display: inline-block;
      color: #F5DFBB;
      text-decoration: none;
  }

  .button:hover {
      background-color: #454036;
  }

  .button:active {
      border: 1px solid black;
  }

  .content-inner {
      max-width: 90ch;
  }
</style>

<div class="page">
  <div class="content">
    <h1>Hey</h1>
    <div class="content-inner">
      <p>
        So, do you know those picture collages with lots of frames that are all a part of one source image?

        <a href="https://www.ikea.com/us/en/p/yllevad-collage-frame-for-4-photos-black-50429768/">Like this one from ikea:</a>
        <img src="ikea-frames.jpg" alt="ikea frames on a wall"/>

        I wanted to make one of those, but I was having trouble visualizing how the picture should look.
        What parts of the big image should be in frames? I don't know, ya gotta be some kinda design genius.

        Anyway, I decided to make this tool that cuts holes from an image so you can see how the final thing will look.
        To use it, put some picture frames on the image and click/drag them around.

        Play around with the different settings, it's pretty cool. You can export your creation whole as an svg/image,
        or broken up into separate images according to your frames.

        Now with 35% less jank 💖
      </p>
      <a class="button" href="/planner">Take a look-see</a>
    </div>
  </div>
</div>