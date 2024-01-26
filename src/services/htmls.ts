export const defaultHtml = `<!DOCTYPE html>
<html lang="en">
	<style>
		#container {
			color: black;
		}
	</style>
		
	<body id="container">
		<h1>Hello world!</h1>
	</body>

	<script></script>
</html>`;

export const cameraHtml = `<style>
#container {
  color: white;
  font-family: "Arial";
}
#menu {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-direction: row;
  align-items: center;
}
#title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 20px;
}
#menu-items {
  margin-left: auto;
  margin-right: 20px;
}
.menu-item {
  font-size: 0.9rem;
  cursor: pointer;
}
.menu-item:hover {
  opacity: 0.5;
}
#camera-background {
  position: absolute;
  top: 50px;
  left: 0;
}
</style>

<body id="container">
<div id="menu">
<span id="title">Cameras</span>
<div id="menu-items">
  <span class="menu-item">Home</span>
  <span class="menu-item">About</span>
  <span class="menu-item">Services</span>
  <span class="menu-item">Contact</span>
</div>
</div>

<img id="camera-background" src="/camera.webp" />
</body>
`;
