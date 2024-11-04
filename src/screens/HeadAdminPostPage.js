import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const HeadAdminPostPage = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: 'https://w0.peakpx.com/wallpaper/319/554/HD-wallpaper-anime-school-girl-anime-landscape-clouds-scenic-summer-anime.jpg' }} style={styles.profileImage} />
          <Text style={styles.profileName}>Lokeswaran</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: 'https://w0.peakpx.com/wallpaper/319/554/HD-wallpaper-anime-school-girl-anime-landscape-clouds-scenic-summer-anime.jpg' }} style={styles.postImage} />

      {/* Interaction Icons */}
      {/* <View style={styles.iconContainer}>
        <View style={styles.leftIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="heart-o" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="comment-o" size={24} color="black" />
          </TouchableOpacity> 
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
         <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bookmark-o" size={24} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Like Count
      <Text style={styles.likeCount}>1,234 likes</Text> */}

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.profileName}>Review: </Text>
        <Text style={styles.caption}>This is the caption of the post with some hashtags </Text>
      </View>

      
      {/* <TouchableOpacity>
        <Text style={styles.viewComments}>View all 12 comments</Text>
      </TouchableOpacity> */}

      {/* Timestamp */}
      <Text style={styles.timestamp}>2 hours ago</Text>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: 'https://w0.peakpx.com/wallpaper/319/554/HD-wallpaper-anime-school-girl-anime-landscape-clouds-scenic-summer-anime.jpg' }} style={styles.profileImage} />
          <Text style={styles.profileName}>Lokeswaran</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: 'https://w0.peakpx.com/wallpaper/319/554/HD-wallpaper-anime-school-girl-anime-landscape-clouds-scenic-summer-anime.jpg' }} style={styles.postImage} />

      {/* Interaction Icons */}
      {/* <View style={styles.iconContainer}>
        <View style={styles.leftIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="heart-o" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="comment-o" size={24} color="black" />
          </TouchableOpacity> 
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
         <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bookmark-o" size={24} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Like Count
      <Text style={styles.likeCount}>1,234 likes</Text> */}

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.profileName}>Review: </Text>
        <Text style={styles.caption}>This is the caption of the post with some hashtags </Text>
      </View>

      
      {/* <TouchableOpacity>
        <Text style={styles.viewComments}>View all 12 comments</Text>
      </TouchableOpacity> */}

      {/* Timestamp */}
      <Text style={styles.timestamp}>2 hours ago</Text>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: 'https://w0.peakpx.com/wallpaper/319/554/HD-wallpaper-anime-school-girl-anime-landscape-clouds-scenic-summer-anime.jpg' }} style={styles.profileImage} />
          <Text style={styles.profileName}>Lokeswaran</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: 'https://w0.peakpx.com/wallpaper/319/554/HD-wallpaper-anime-school-girl-anime-landscape-clouds-scenic-summer-anime.jpg' }} style={styles.postImage} />

      {/* Interaction Icons */}
      {/* <View style={styles.iconContainer}>
        <View style={styles.leftIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="heart-o" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="comment-o" size={24} color="black" />
          </TouchableOpacity> 
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
         <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bookmark-o" size={24} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Like Count
      <Text style={styles.likeCount}>1,234 likes</Text> */}

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.profileName}>Review: </Text>
        <Text style={styles.caption}>This is the caption of the post with some hashtags </Text>
      </View>

      
      {/* <TouchableOpacity>
        <Text style={styles.viewComments}>View all 12 comments</Text>
      </TouchableOpacity> */}

      {/* Timestamp */}
      <Text style={styles.timestamp}>2 hours ago</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor:'#ffffff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 16,
    color:'#A3238F',
  },
  postImage: {
    width: '100%',
    height: 400,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  leftIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginRight: 15,
  },

  captionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  caption: {
    fontSize: 14,
    flex: 1,
  },

  timestamp: {
    color: 'gray',
    marginLeft: 10,
    fontSize: 12,
    paddingBottom: 10,
    marginBottom:15,
  },
});

export default HeadAdminPostPage;
